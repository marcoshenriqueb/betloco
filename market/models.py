from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class MarketType(models.Model):
    """docstring for Market"""
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)

class Market(models.Model):
    """docstring for Market"""
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True,)
    market_type = models.ForeignKey(MarketType, on_delete=models.CASCADE,)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    deadline = models.DateTimeField(auto_now=False, auto_now_add=False, null=False, blank=False)
    trading_fee = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField()

class Choice(models.Model):
    """docstring for Choice"""
    market = models.ForeignKey(Market, on_delete=models.CASCADE,)
    title = models.CharField(max_length=100)

class Operation(models.Model):
    """docstring for Operation"""
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    choice = models.ForeignKey(Choice, on_delete=models.PROTECT)
    amount = models.IntegerField(blank=False, null=False)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
    pending = models.BooleanField(default=False)
