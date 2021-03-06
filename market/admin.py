from django.contrib import admin
from .models import Event, EventType, EventCategory, Market, Order, Operation

class MarketInline(admin.TabularInline):
    """docstring for MarketInline"""
    model = Market

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('id', 'title', 'event_type', 'event_category', 'user', 'updated_at')
    list_display_links = ('title',)
    list_filter = ('updated_at', 'event_type', 'event_category')
    inlines = [
        MarketInline,
    ]

    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'title', 'updated_at')
    list_display_links = ('title',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('id', 'amount', 'price', 'user', 'updated_at')
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

admin.site.register(EventCategory)
admin.site.register(EventType)
