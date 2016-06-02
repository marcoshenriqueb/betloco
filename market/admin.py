from django.contrib import admin
from .models import MarketType, MarketCategory, Market, Choice, Order, Operation

@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('id', 'title', 'market_type', 'market_category', 'user', 'updated_at')
    list_display_links = ('title',)
    list_filter = ('updated_at', 'market_type', 'market_category')

    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'market')
    list_display_links = ('title',)
    search_fields = ['market__title']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('id', 'amount', 'price', 'choice', 'user', 'updated_at')
    list_display_links = ('id', 'amount')
    list_filter = ('updated_at',)
    search_fields = ['choice__market__title']

    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

@admin.register(Operation)
class OperationAdmin(admin.ModelAdmin):
    list_display = ('id', 'amount', 'price', 'from_order', 'to_order', 'updated_at')
    list_display_links = ('id', 'amount')
    list_filter = ('updated_at',)
    search_fields = ['to_order__choice__market__title']

admin.site.register(MarketCategory)
admin.site.register(MarketType)
