from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver
from .models import Order, Event, Market
from engine.engine import OrderEngine
from channels import Channel
from django.core.exceptions import ValidationError
import json

@receiver(post_save, sender=Order)
def postSaveOrder(sender, instance, created, **kwargs):
    if created and instance.residual == 0:
        e = OrderEngine(instance)
        e.findMatchingOffers()

        pk = instance.choice.market.id
        Channel("market-update").send({
            "room": 'market-' + str(pk),
            "message": json.dumps({'pk': str(pk)})
        })

@receiver(pre_save, sender=Market)
def preSaveChoice(sender, instance, *args, **kwargs):
    if instance.winner:
        markets = instance.event.markets.all()
        for m in markets:
            if m.winner:
                raise ValidationError('Cannot choose two winners!!!')
