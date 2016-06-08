from django.db import models
from django.contrib.auth.models import User
from market.models import Order, Operation
from django.db.models import Sum, F, Q

class Currency(models.Model):
    """docstring for Currency"""
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

    def __str__(self):
        return self.name

class TransactionManager(models.Manager):
    """docstring for TransactionManager"""
    def balance(self, user_id):
        netTransactions = self.filter(user__id=user_id).aggregate(value=Sum('value'))['value']
        netOrders = Order.objects.filter(user__id=user_id) \
                                 .filter(from_order__isnull=True) \
                                 .filter(to_order__isnull=True) \
                                 .aggregate(value=Sum(F('amount')*F('price'), output_field=models.FloatField()))['value']
        netOperations = Operation.objects.filter(to_order__user__id=user_id) \
                                         .filter(to_order__amount__gt=0)
        return netOperations
        return netTransactions - netOrders

class Transaction(models.Model):
    """docstring for Transaction"""
    user = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True,)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, blank=True, null=True,)
    value = models.IntegerField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    objects = TransactionManager()
    def __str__(self):
        return str(self.value)
