from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Price(models.Model):
    """docstring for Price"""
    market = models.ForeignKey('market.Market', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=False, auto_now_add=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True)
    price = models.FloatField(validators = [MinValueValidator(0.0), MaxValueValidator(1.0)])
