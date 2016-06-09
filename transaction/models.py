from django.db import models
from django.contrib.auth.models import User
from market.models import Order, Operation
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Sum, F, Q

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
        netTransactions = self.filter(user__id=user_id).aggregate(value=Sum('value'))['value'] or 0
        netOrders = Order.objects.filter(user__id=user_id) \
                                 .filter(amount__gt=0) \
                                 .filter(from_order__isnull=True) \
                                 .filter(to_order__isnull=True) \
                                 .aggregate(value=Sum(F('amount')*F('price'), output_field=models.FloatField()))['value'] or 0
        buyOperations = Operation.objects.filter(to_order__user__id=user_id) \
                                         .filter(Q(to_order__amount__gt=0) | Q(from_order__amount__gt=0)) \
                                         .aggregate(value=Sum(F('amount')*F('price')))['value'] or 0
        sellOperations = Operation.objects.filter(to_order__user__id=user_id) \
                                          .filter(Q(to_order__amount__lt=0) | Q(from_order__amount__lt=0)) \
                                          .aggregate(value=Sum(F('amount')*F('price')))['value'] or 0
        # Preço da operação não me dá informação suficiente
        return netTransactions - netOrders - buyOperations + sellOperations

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

class TransactionDetail(models.Model):
    """docstring for TransactionDetail"""
    transaction = models.OneToOneField(Transaction, on_delete=models.PROTECT)
    amount = models.IntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
    order = models.ForeignKey(Order, on_delete=models.PROTECT,)
