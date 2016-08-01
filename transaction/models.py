from django.db import models
from django.contrib.auth.models import User
from market.models import Order, Event, Market, Sum, F, Operation, When
from django.db.models import Max, Case, Count
from django.core.validators import MaxValueValidator, MinValueValidator

class Currency(models.Model):
    """docstring for Currency"""
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class TransactionType(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class TransactionManager(models.Manager):
    """docstring for TransactionManager"""
    def balance(self, user_id, new_order=None):
        transactions = self.filter(user__id=user_id).aggregate(balance=Sum('value'))['balance'] or 0
        orders = Order.objects.filter(user__id=user_id).filter(deleted=0).values('market__id') \
                              .annotate(balance=Sum(Case(
                                  When(from_order__isnull=False, amount__gt=0, then=F('from_order__amount')*F('from_order__price')),
                                  When(from_order__isnull=False, amount__lt=0, then=-1*F('from_order__amount')*F('from_order__price')),
                                  When(to_order__isnull=False, amount__gt=0, then=F('to_order__amount')*F('price')),
                                  When(to_order__isnull=False, amount__lt=0, then=-1*F('to_order__amount')*F('price')),
                                  default=0,
                                  output_field=models.FloatField()
                                )),
                                amount_sum=Sum(Case(
                                  When(from_order__isnull=True, to_order__isnull=True, amount__gt=0, then=0),
                                  When(from_order__isnull=True, to_order__isnull=True, amount__lt=0, then=0),
                                  When(from_order__isnull=False, amount__gt=0, then=F('from_order__amount')),
                                  When(from_order__isnull=False, amount__lt=0, then=-1*F('from_order__amount')),
                                  When(to_order__isnull=False, amount__gt=0, then=F('to_order__amount')),
                                  When(to_order__isnull=False, amount__lt=0, then=-1*F('to_order__amount')),
                                  default=0,
                                  output_field=models.IntegerField()
                                )),
                                sell_orders_balance=Sum(Case(
                                  When(from_order__isnull=True, to_order__isnull=True, amount__lt=0, then=F('amount')*F('price')),
                                  default=0,
                                  output_field=models.FloatField()
                                )),
                                sell_orders_amount=Sum(Case(
                                  When(from_order__isnull=True, to_order__isnull=True, amount__lt=0, then=F('amount')),
                                  default=0,
                                  output_field=models.IntegerField()
                                )),
                                buy_orders_balance=Sum(Case(
                                  When(from_order__isnull=True, to_order__isnull=True, amount__gt=0, then=F('amount')*F('price')),
                                  default=0,
                                  output_field=models.FloatField()
                                )),
                                buy_orders_amount=Sum(Case(
                                  When(from_order__isnull=True, to_order__isnull=True, amount__gt=0, then='amount'),
                                  default=0,
                                  output_field=models.IntegerField()
                                ))
                              ).values('market__id',
                                       'balance',
                                       'sell_orders_balance',
                                       'buy_orders_balance',
                                       'sell_orders_amount',
                                       'buy_orders_amount',
                                       'amount_sum',
                                       'market__event__id')
        events = {}
        if new_order is not None:
            market_id = new_order['market__id'] if 'market__id' in new_order else new_order['market'].id
            new_order_added = False
        for o in orders:
            if new_order is not None and int(o['market__id']) == market_id:
                new_order_added = True
                o['amount_sum'] += int(new_order['amount'])
                o['balance'] += int(new_order['amount'])*float(new_order['price'])
            if o['market__event__id'] in events:
                events[o['market__event__id']].append(o)
            else:
                events[o['market__event__id']] = [o,]
        if new_order is not None and not new_order_added:
            m = Market.objects.get(pk=market_id)
            e = m.event
            result_order = {
                'amount_sum': int(new_order['amount']),
                'balance': int(new_order['amount'])*float(new_order['price']),
                'market__id': m.id,
                'sell_orders_balance': 0,
                'buy_orders_balance': 0,
                'sell_orders_amount': 0,
                'buy_orders_amount': 0,
                'market__event__id': e.id
            }
            if e.id in events:
                events[e.id].append(result_order)
            else:
                events[e.id] = [result_order,]
        markets_count = Event.objects.filter(id__in=events.keys()).values('id').annotate(Count('markets'))
        events_wc = {}
        for k, e in events.items():
            c = 0
            for m in markets_count:
                if m['id'] == k:
                    c = m['markets__count']
            events_wc[k] = {
                'count': c,
                'markets': e
            }
        total_risk = 0
        balance = 0
        for k, e in events_wc.items():
            events_risk = None
            count = 0
            position_count = 0
            for m in e['markets']:
                if m['amount_sum'] != 0 or m['sell_orders_amount'] != 0 or m['buy_orders_amount'] != 0:
                    position_count += 1
            if position_count > 1:
                for m in e['markets']:
                    if m['amount_sum'] != 0 or m['sell_orders_amount'] != 0 or m['buy_orders_amount'] != 0:
                        count += 1
                        risk = 0
                        for n in e['markets']:
                            if n['amount_sum'] != 0 or n['sell_orders_amount'] != 0 or n['buy_orders_amount'] != 0:
                                if m['market__id'] == n['market__id']:
                                    custody_risk = -1*((1-n['balance']/n['amount_sum'])*n['amount_sum']) \
                                                    if n['amount_sum'] != 0 else 0
                                    sell_risk = custody_risk - (1-n['sell_orders_balance']/n['sell_orders_amount'])*n['sell_orders_amount'] \
                                                if n['sell_orders_amount'] != 0 else custody_risk
                                    risk += sell_risk
                                else:
                                    custody_risk = n['balance']
                                    buy_risk = custody_risk + n['buy_orders_balance']
                                    risk += buy_risk
                        if events_risk is None or events_risk < risk:
                            events_risk = risk
                    else:
                        balance += m['balance']
                if int(e['count']) > count:
                    risk = 0
                    for n in e['markets']:
                        if n['amount_sum'] != 0 or n['sell_orders_amount'] != 0 or n['buy_orders_amount'] != 0:
                            custody_risk = n['balance']
                            buy_risk = custody_risk + n['buy_orders_balance']
                            risk += buy_risk
                    if events_risk is None or events_risk < risk:
                        events_risk = risk
                total_risk += events_risk
            else:
                for m in e['markets']:
                    risks = []
                    if m['amount_sum'] != 0 or m['sell_orders_amount'] != 0 or m['buy_orders_amount'] != 0:
                        if m['amount_sum'] >= 0:
                            custody_risk = m['balance']
                            buy_risk = custody_risk + m['buy_orders_balance']
                            sell_risk = abs(custody_risk + ((1-m['sell_orders_balance']/m['sell_orders_amount'])*m['sell_orders_amount']) \
                                        if m['sell_orders_amount'] != 0 else custody_risk)
                        else:
                            custody_risk = abs((1-m['balance']/m['amount_sum'])*m['amount_sum'])
                            sell_risk = abs(custody_risk + ((1-m['sell_orders_balance']/m['sell_orders_amount'])*m['sell_orders_amount']) \
                                        if m['sell_orders_amount'] != 0 else custody_risk)
                            buy_risk = abs(custody_risk - m['buy_orders_balance'])
                    else:
                        custody_risk = 0
                        buy_risk = custody_risk
                        sell_risk = custody_risk
                        balance += m['balance']

                    total_risk += max([custody_risk,sell_risk,buy_risk])

        return {
            'total': transactions - total_risk - balance,
            'transactions': transactions,
            'balance': balance*-1,
            'risk': total_risk
        }


class Transaction(models.Model):
    """docstring for Transaction"""
    user = models.ForeignKey(User, on_delete=models.PROTECT,)
    transaction_type = models.ForeignKey(TransactionType, on_delete=models.PROTECT)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, blank=True, null=True,)
    value = models.IntegerField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    objects = TransactionManager()
    def __str__(self):
        return str(self.value)
