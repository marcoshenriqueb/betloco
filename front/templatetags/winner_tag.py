from django import template
from market import models

register = template.Library()

@register.inclusion_tag('admin/market/event/choose_winner.html')
def choose_winner(document_id):
    markets = models.Market.objects.filter(event__id=document_id)
    return { 'markets': markets, 'event__id': document_id }
