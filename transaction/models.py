from django.db import models
from django.contrib.auth.models import User
from market.models import Order, Event, Sum, F, Operation, When
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
    def balance(self, user_id):
        transactions = self.filter(user__id=user_id).aggregate(balance=Sum('value'))['balance'] or 0
        orders = Order.objects.filter(user__id=user_id).filter(deleted=0).values('choice__market__id') \
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
                                  When(from_order__isnull=True, to_order__isnull=True, amount__lt=0, then=-1*F('amount')*F('price')),
                                  default=0,
                                  output_field=models.FloatField()
                                )),
                                sell_orders_amount=Sum(Case(
                                  When(from_order__isnull=True, to_order__isnull=True, amount__lt=0, then=-1*F('amount')),
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
                              ).values('choice__market__id',
                                       'choice__id',
                                       'choice__title',
                                       'balance',
                                       'sell_orders_balance',
                                       'buy_orders_balance',
                                       'sell_orders_amount',
                                       'buy_orders_amount',
                                       'amount_sum',
                                       'choice__market__event__id')
                            #   .aggregate(balance_sum=Sum('balance'))
        events = {}
        for o in orders:
            if o['choice__market__event__id'] in events:
                events[o['choice__market__event__id']].append(o)
            else:
                events[o['choice__market__event__id']] = [o,]
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
        for k, e in events_wc.items():
            events_risk = None
            count = 0
            if len(e['markets']) > 1:
                for m in e['markets']:
                    count += 1
                    risk = 0
                    for n in e['markets']:
                        if n['choice__title'] == "Sim" and m['choice__market__id'] == n['choice__market__id']:
                            risk += n['balance'] - n['amount_sum']
                            risk -= n['sell_orders_balance'] - n['sell_orders_amount']
                        elif n['choice__title'] == "Sim":
                            risk += n['balance']
                            risk += n['buy_orders_balance']
                        elif n['choice__title'] == "Não" and m['choice__market__id'] == n['choice__market__id']:
                            risk += n['balance']
                            risk += n['buy_orders_balance']
                        else:
                            risk += n['balance'] - n['amount_sum']
                            risk -= n['sell_orders_balance'] - n['sell_orders_amount']
                    if events_risk is None or events_risk < risk:
                        events_risk = risk
                if int(e['count']) > count:
                    risk = 0
                    for n in e['markets']:
                        if n['choice__title'] == "Sim":
                            risk += n['balance']
                            risk += n['buy_orders_balance']
                        else:
                            risk += n['balance'] - n['amount_sum']
                            risk -= n['sell_orders_balance'] - n['sell_orders_amount']
                    if events_risk is None or events_risk < risk:
                        events_risk = risk
                total_risk += events_risk
            else:
                for m in e['markets']:
                    total_risk += m['balance']

        return {
            'total': transactions - total_risk,
            'transactions': transactions,
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
