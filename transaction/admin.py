from django.contrib import admin
from .models import Currency, Transaction, TransactionType

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'value', 'currency', 'created_at')
    list_display_links = ('user', 'value')
    list_filter = ('user',)

@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'symbol')
    list_display_links = ('id', 'name')
