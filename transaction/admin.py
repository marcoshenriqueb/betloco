from django.contrib import admin
from .models import Currency, Transaction

@admin.register(Transaction)
class MarketAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('id', 'user', 'value', 'currency', 'created_at')
    list_display_links = ('user', 'value')

    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

admin.site.register(Currency)
