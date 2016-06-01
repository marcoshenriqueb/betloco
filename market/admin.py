from django.contrib import admin
from .models import MarketType, MarketCategory, Market, Choice, Order, Operation

admin.site.register(MarketType)
admin.site.register(Market)
admin.site.register(Choice)
admin.site.register(Order)
admin.site.register(Operation)
admin.site.register(MarketCategory)
