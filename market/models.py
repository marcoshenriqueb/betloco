from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class MarketType(models.Model):
    """docstring for Market"""
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class Market(models.Model):
    """docstring for Market"""
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True,)
    market_type = models.ForeignKey(MarketType, on_delete=models.CASCADE,)
    trading_fee = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField()
    deadline = models.DateTimeField(auto_now=False, auto_now_add=False, null=False, blank=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.title

class Choice(models.Model):
    """docstring for Choice"""
    market = models.ForeignKey(Market, on_delete=models.CASCADE,)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

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
                                       through_fields=('from_order_id', 'to_order_id'),
                                       symmetrical=False,
                                       related_name='operation')

class Operation(models.Model):
    """docstring for Operation"""
    from_order_id = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='from_order')
    to_order_id = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='to_order')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    amount = models.PositiveIntegerField(blank=False, null=False)

    class Meta:
        unique_together = (('from_order_id', 'to_order_id'),)
