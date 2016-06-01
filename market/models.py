from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Sum, Max, Q
import operator, functools

class MarketType(models.Model):
    """docstring for Market"""
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class MarketCategory(models.Model):
    """docstring for MarketCategory"""
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class Market(models.Model):
    """docstring for Market"""
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True,)
    market_type = models.ForeignKey(MarketType, on_delete=models.PROTECT,)
    market_category = models.ForeignKey(MarketCategory, on_delete=models.PROTECT,)
    trading_fee = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField()
    deadline = models.DateTimeField(auto_now=False, auto_now_add=False, null=False, blank=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.title

    def _getVolume(self):
        q = []
        for c in self.choices.all():
            q.append(Q(from_order__choice__id=c.id))
            q.append(Q(to_order__choice__id=c.id))

        q_query = functools.reduce(operator.or_, q)
        result = Operation.objects.filter(q_query) \
                        .aggregate(Sum('amount'))['amount__sum']
        return result or 0

    volume = property(_getVolume)

class Choice(models.Model):
    """docstring for Choice"""
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name="choices")
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

    def _getLastCompleteOrder(self):
        o = Operation.objects.filter(Q(from_order__choice__id=self.id) | Q(to_order__choice__id=self.id)) \
                             .order_by('-created_at')[0:1].get()
        return self.order_set.filter(Q(from_order__id=o.id) | Q(to_order__id=o.id))[0:1].get()
    lastCompleteOrder = property(_getLastCompleteOrder)

class Order(models.Model):
    """docstring for Order"""
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    choice = models.ForeignKey(Choice, on_delete=models.PROTECT)
    amount = models.IntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    matches = models.ManyToManyField('self',
                                       through='Operation',
                                       through_fields=('from_order', 'to_order'),
                                       symmetrical=False,
                                       related_name='operation')

    def __str__(self):
        return str(self.price)

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
