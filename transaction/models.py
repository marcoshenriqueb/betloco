from django.db import models
from django.contrib.auth.models import User
from market.models import Order, Sum, F, Operation
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
        transactions = self.filter(user__id=user_id).filter(transaction_type__id=1).aggregate(balance=Sum('value'))['balance'] or 0
        buyOrders = Order.objects.filter(user__id=user_id).filter(from_order__isnull=True) \
            .filter(to_order__isnull=True) \
            .filter(amount__gt=0) \
            .filter(deleted=0) \
            .aggregate(balance=Sum(F('amount')*F('price'), output_field=models.FloatField()))['balance'] or 0
        fromOrderBuyOperations = Operation.objects.filter(from_order__user__id=user_id) \
           .filter(from_order__amount__gt=0) \
           .aggregate(balance=Sum(F('amount')*F('price'), output_field=models.FloatField()))['balance'] or 0
        fromOrderSellOperations = Operation.objects.filter(from_order__user__id=user_id) \
           .filter(from_order__amount__lt=0) \
           .aggregate(balance=Sum(F('amount')*F('price'), output_field=models.FloatField()))['balance'] or 0
        toOrderOperations = Operation.objects.filter(to_order__user__id=user_id) \
           .aggregate(balance=Sum(F('to_order__amount')*F('to_order__price'), output_field=models.FloatField()))['balance'] or 0
        return {
            'total': transactions - buyOrders - fromOrderBuyOperations + fromOrderSellOperations - toOrderOperations,
            'transactions': transactions,
            'buyOrders': buyOrders,
            'operations': - fromOrderBuyOperations + fromOrderSellOperations - toOrderOperations
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
