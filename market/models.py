from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Sum, Avg, Q, F, Case, When
from django.utils import timezone
import operator, functools
from itertools import chain
from channels import Channel

class EventType(models.Model):
    """docstring for EventType"""
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class EventCategory(models.Model):
    """docstring for EventCategory"""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    """docstring for Event"""
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True,)
    event_type = models.ForeignKey(EventType, on_delete=models.PROTECT,)
    event_category = models.ForeignKey(EventCategory, on_delete=models.PROTECT,)
    trading_fee = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField()
    deadline = models.DateTimeField(auto_now=False, auto_now_add=False, null=False, blank=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.title

    def _getVolume(self):
        try:
            q = []
            for m in self.markets.all():
                q.append(Q(from_order__market__id=m.id))
                q.append(Q(to_order__market__id=m.id))

            q_query = functools.reduce(operator.or_, q)
            result = Operation.objects.filter(q_query).filter(from_liquidation=0) \
                            .aggregate(Sum('amount'))['amount__sum']
            return result or 0
        except TypeError as e:
            return 0

    volume = property(_getVolume)

class MarketManager(models.Manager):
    """docstring for MarketManager"""
    def set_winner(self, market_id):
        if market_id:
            e = self.get(id=market_id).event
            if e.deadline < timezone.now():
                markets = Market.objects.filter(event__id=e.id)
                if len(markets.filter(winner=1)) > 0:
                    markets.update(winner=0)
                    for m in markets:
                        m.order_set.filter(from_liquidation=1).delete()
                winner_market = markets.get(id=market_id)
                winner_market.winner = 1
                winner_market.liquidated = 1
                winner_market.save()
                Channel("liquidate-market").send({
                    "market_id": winner_market.id
                })
                loosers_markets = e.markets.filter(~Q(id=market_id))
                for m in loosers_markets:
                    m.liquidated = 1
                    m.save()
                    Channel("liquidate-market").send({
                        "market_id": m.id
                    })

    def custody(self, user_id, market_id):
        market = self.get(id=market_id)
        result = market.order_set.filter(user__id=user_id) \
                   .filter(Q(from_order__isnull=False) | Q(to_order__isnull=False)) \
                   .aggregate(position=Sum(Case(
                        When(from_order__isnull=False, amount__gt=0, then='from_order__amount'),
                        When(from_order__isnull=False, amount__lt=0, then=-1*F('from_order__amount')),
                        When(to_order__isnull=False, amount__gt=0, then='to_order__amount'),
                        When(to_order__isnull=False, amount__lt=0, then=-1*F('to_order__amount'))
                    )))['position'] or 0
        return result


class Market(models.Model):
    """docstring for Market"""
    title = models.CharField(max_length=150)
    title_short = models.CharField(max_length=100)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="markets")
    liquidated = models.BooleanField(default=False)
    winner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    objects = MarketManager()

    def __str__(self):
        return self.title

    def _getVolume(self):
        try:
            q = []
            q.append(Q(from_order__market__id=self.id))
            q.append(Q(to_order__market__id=self.id))
            q_query = functools.reduce(operator.or_, q)
            result = Operation.objects.filter(q_query).filter(from_liquidation=0) \
                            .aggregate(Sum('amount'))['amount__sum']
            return result or 0
        except TypeError as e:
            return 0

    volume = property(_getVolume)

    def _getTopToBuy(self, limit=5, group=True):
        orders = self.order_set.filter(to_order__isnull=True) \
                            .filter(from_order__isnull=True) \
                            .filter(amount__lt=0) \
                            .filter(deleted=0)
        for o in orders:
            o.amount = o.amount * (-1)
        l = list(chain(orders,))
        l.sort(key=lambda x: (x.price, x.created_at), reverse=False)
        if group:
            precedingItem = None
            result = []
            for v in l:
                if precedingItem and precedingItem.price == v.price:
                    v.amount += precedingItem.amount
                    result[len(result)-1] = v
                else:
                    result.append(v)
                precedingItem = v
            return result[0:limit]
        return l[0:limit]

    topBuys = property(_getTopToBuy)

    def _getTopToSell(self, limit=5, group=True):
        orders = self.order_set.filter(to_order__isnull=True) \
                            .filter(from_order__isnull=True) \
                            .filter(amount__gt=0) \
                            .filter(deleted=0)
        l = list(chain(orders,))
        l.sort(key=lambda x: x.created_at, reverse=False)
        l.sort(key=lambda x: x.price, reverse=True)
        if group:
            precedingItem = None
            result = []
            for v in l:
                if precedingItem and precedingItem.price == v.price:
                    v.amount += precedingItem.amount
                    result[len(result)-1] = v
                else:
                    result.append(v)
                precedingItem = v
            return result[0:limit]
        return l[0:limit]

    topSells = property(_getTopToSell)

    def _getLastCompleteOrder(self):
        o = Operation.objects.filter(Q(from_order__market__id=self.id) | Q(to_order__market__id=self.id)) \
                             .filter(from_liquidation=0) \
                             .order_by('-created_at')[0:1].get()
        order = self.order_set.filter(Q(from_order__id=o.id) | Q(to_order__id=o.id))[0:1].get()
        if order.id == o.from_order_id:
            order.price = o.price
        return order
    lastCompleteOrder = property(_getLastCompleteOrder)


class OrderManager(models.Manager):
    """docstring for OrderManager"""
    def getAllMarketPositions(self, market_id):
        positions = self.filter(market__id=market_id).values('user__id', 'market__id') \
                        .annotate(position=Sum(Case(
                            When(from_order__isnull=False, amount__gt=0, then='from_order__amount'),
                            When(from_order__isnull=False, amount__lt=0, then=-1*F('from_order__amount')),
                            When(to_order__isnull=False, amount__gt=0, then='to_order__amount'),
                            When(to_order__isnull=False, amount__lt=0, then=-1*F('to_order__amount'))
                        )))
        positive_positions = [p for p in positions if p['position'] > 0]
        return positive_positions

    def getPlayerPositions(self, user_id):
        positions = self.filter(user__id=user_id) \
                       .filter(Q(from_order__isnull=False) | Q(to_order__isnull=False)) \
                       .values('market__id').annotate(position=Sum(Case(
                            When(from_order__isnull=False, amount__gt=0, then='from_order__amount'),
                            When(from_order__isnull=False, amount__lt=0, then=-1*F('from_order__amount')),
                            When(to_order__isnull=False, amount__gt=0, then='to_order__amount'),
                            When(to_order__isnull=False, amount__lt=0, then=-1*F('to_order__amount'))
                        )))
        positive_positions = [p for p in positions if p['position'] > 0]
        for p in positive_positions:
            p['market'] = Market.objects.filter(pk=p['market__id']).values(
                                                                    'id',
                                                                    'title',
                                                                    'title_short'
                                                                ).get()
        return positive_positions

    def getPlayerHistory(self, user_id):
        history = self.filter(user__id=user_id) \
                       .filter(Q(from_order__isnull=False) | Q(to_order__isnull=False)) \
                       .values('id').annotate(
                            amount_sum=Sum(Case(
                                When(from_order__isnull=False, amount__gt=0, then='from_order__amount'),
                                When(from_order__isnull=False, amount__lt=0, then=-1*F('from_order__amount')),
                                When(to_order__isnull=False, amount__gt=0, then='to_order__amount'),
                                When(to_order__isnull=False, amount__lt=0, then=-1*F('to_order__amount'))
                            )),
                            price_avg=Avg(Case(
                                When(from_order__isnull=False, then='from_order__price'),
                                When(to_order__isnull=False, then='price')
                            ))
                        ).values(
                            'id',
                            'market__title',
                            'market__title_short',
                            'amount_sum',
                            'created_at',
                            'price_avg'
                        )
        return history

    def getOpenOrders(self, user_id, market_id=None):
        if market_id:
            return self.filter(user__id=user_id).filter(market__id=market_id) \
                                                .filter(from_order__isnull=True) \
                                                .filter(to_order__isnull=True) \
                                                .filter(deleted=0) \
                                                .filter(from_liquidation=0) \
                                                .values('id', 'price', 'amount')
        else:
            return self.filter(user__id=user_id).filter(from_order__isnull=True) \
                                                .filter(to_order__isnull=True) \
                                                .filter(deleted=0) \
                                                .filter(from_liquidation=0) \
                                                .values('id', 'market__title', 'market__title_short', 'market__id', 'price', 'amount')

    def deleteOpenOrders(self, user_id, orders):
        for o in orders:
            o = self.filter(user__id=user_id).get(pk=o['id'])
            o.deleted = 1
            o.save()

class Order(models.Model):
    """docstring for Order"""
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    amount = models.IntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    residual = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    from_liquidation = models.BooleanField(default=False)
    matches = models.ManyToManyField('self',
                                       through='Operation',
                                       through_fields=('from_order', 'to_order'),
                                       symmetrical=False,
                                       related_name='operation')
    objects = OrderManager()
    def __str__(self):
        return str(self.id)

class Operation(models.Model):
    """docstring for Operation"""
    from_order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='from_order')
    to_order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='to_order')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    amount = models.PositiveIntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
    from_liquidation = models.BooleanField(default=False)

    class Meta:
        unique_together = (('from_order', 'to_order'),)
