from django.contrib import admin
from .models import Currency, Transaction, TransactionType, TransactionDetail

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('id', 'user', 'value', 'currency', 'created_at')
    list_display_links = ('user', 'value')
    list_filter = ('user',)
    
    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'symbol')
    list_display_links = ('id', 'name')

@admin.register(TransactionDetail)
class TransactionDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'price', 'amount', 'order')
    list_display_links = ('id', 'price', 'amount')
