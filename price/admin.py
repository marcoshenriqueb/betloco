from django.contrib import admin
from .models import Price

# Register your models here.
@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ('id', 'market', 'price', 'date')
    list_display_links = ('id',)
