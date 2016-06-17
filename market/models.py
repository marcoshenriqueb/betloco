from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Sum, Q, F
import operator, functools
from itertools import chain

@models.IntegerField.register_lookup
class AbsoluteValue(models.Transform):
    lookup_name = 'abs'
    function = 'ABS'

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
                for c in m.choices.all():
                    q.append(Q(from_order__choice__id=c.id))
                    q.append(Q(to_order__choice__id=c.id))

            q_query = functools.reduce(operator.or_, q)
            result = Operation.objects.filter(q_query) \
                            .aggregate(Sum('amount'))['amount__sum']
            return result or 0
        except TypeError as e:
            return 0

    volume = property(_getVolume)

class Market(models.Model):
    """docstring for Market"""
    title = models.CharField(max_length=100)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="markets")
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.title

    def _getVolume(self):
        try:
            q = []
            for c in self.choices.all():
                q.append(Q(from_order__choice__id=c.id))
                q.append(Q(to_order__choice__id=c.id))

            q_query = functools.reduce(operator.or_, q)
            result = Operation.objects.filter(q_query) \
                            .aggregate(Sum('amount'))['amount__sum']
            return result or 0
        except TypeError as e:
            return 0

    volume = property(_getVolume)

class ChoiceManager(models.Manager):
    """docstring for ChoiceManager"""
    def custody(self, user_id, market_id, choice_id=None, not_choice_id=None):
        if choice_id:
            choices = self.filter(id=choice_id)
        elif not_choice_id:
            choices = self.get(id=not_choice_id).market.choices.filter(~Q(id=not_choice_id))
        else:
            choices = self.filter(market__id=market_id)
        result = {}
        for c in choices:
            v1 = c.order_set.filter(user__id=user_id) \
                            .filter(amount__gt=0) \
                            .filter(from_order__isnull=False) \
                            .aggregate(custody=Sum('from_order__amount'))['custody'] \
                            or 0
            v2 = c.order_set.filter(user__id=user_id) \
                            .filter(amount__lt=0) \
                            .filter(from_order__isnull=False) \
                            .aggregate(custody=Sum('from_order__amount'))['custody'] \
                            or 0
            v3 = c.order_set.filter(user__id=user_id) \
                            .filter(amount__gt=0) \
                            .filter(to_order__isnull=False) \
                            .aggregate(custody=Sum('to_order__amount'))['custody'] \
                            or 0
            v4 = c.order_set.filter(user__id=user_id) \
                            .filter(amount__lt=0) \
                            .filter(to_order__isnull=False) \
                            .aggregate(custody=Sum('to_order__amount'))['custody'] \
                            or 0
            result[c.id] = {
                'choice': c.title,
                'position': v1 - v2 + v3 - v4
            }
        return result

class Choice(models.Model):
    """docstring for Choice"""
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name="choices")
    title = models.CharField(max_length=100)
    objects = ChoiceManager()

    def __str__(self):
        return self.title

    def _getLastCompleteOrder(self):
        o = Operation.objects.filter(Q(from_order__choice__id=self.id) | Q(to_order__choice__id=self.id)) \
                             .order_by('-created_at')[0:1].get()
        order = self.order_set.filter(Q(from_order__id=o.id) | Q(to_order__id=o.id))[0:1].get()
        if order.id == o.from_order_id:
            order.price = o.price
        return order
    lastCompleteOrder = property(_getLastCompleteOrder)

    def _getTopToBuy(self, limit=5, group=True):
        cross_orders = Order.objects.filter(choice__market__id=self.market.id) \
                            .filter(from_order__isnull=True) \
                            .filter(to_order__isnull=True) \
                            .filter(~Q(choice__id=self.id)) \
                            .filter(amount__gt=0) \
                            .filter(deleted=0)
        for o in cross_orders:
            o.price = round(1 - o.price, 2)
        orders = self.order_set.filter(to_order__isnull=True) \
                            .filter(from_order__isnull=True) \
                            .filter(amount__lt=0) \
                            .filter(deleted=0)
        for o in orders:
            o.amount = o.amount * (-1)
        l = list(chain(orders, cross_orders))
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
        cross_orders = Order.objects.filter(choice__market__id=self.market.id) \
                            .filter(from_order__isnull=True) \
                            .filter(to_order__isnull=True) \
                            .filter(~Q(choice__id=self.id)) \
                            .filter(amount__lt=0) \
                            .filter(deleted=0)
        for o in cross_orders:
            o.price = round(1 - o.price, 2)
            o.amount = o.amount * (-1)
        orders = self.order_set.filter(to_order__isnull=True) \
                            .filter(from_order__isnull=True) \
                            .filter(amount__gt=0) \
                            .filter(deleted=0)
        l = list(chain(orders, cross_orders))
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

class OrderManager(models.Manager):
    """docstring for OrderManager"""
    def getOpenOrders(self, user_id, market_id=None):
        if market_id:
            return self.filter(user__id=user_id).filter(choice__market__id=market_id) \
                                                .filter(from_order__isnull=True) \
                                                .filter(to_order__isnull=True) \
                                                .filter(deleted=0)
        else:
            return self.filter(user__id=user_id).filter(from_order__isnull=True) \
                                                .filter(to_order__isnull=True) \
                                                .filter(deleted=0)

    def deleteOpenOrders(self, user_id, orders):
        for o in orders:
            o = self.filter(user__id=user_id).get(pk=o['id'])
            o.deleted = 1
            o.save()

class Order(models.Model):
    """docstring for Order"""
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    choice = models.ForeignKey(Choice, on_delete=models.PROTECT)
    amount = models.IntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    residual = models.BooleanField(default=0)
    deleted = models.BooleanField(default=0)
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
    from_order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='from_order')
    to_order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='to_order')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    amount = models.PositiveIntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])

    class Meta:
        unique_together = (('from_order', 'to_order'),)
