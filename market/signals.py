from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver
from .models import Order, Choice, Event, Market
from engine.engine import OrderEngine
from channels import Channel
from django.utils import timezone
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

@receiver(pre_save, sender=Choice)
def preSaveChoice(sender, instance, *args, **kwargs):
    if instance.winner:
        choices = instance.market.choices.all()
        for c in choices:
            if c.winner:
                raise ValidationError('Cannot choose two winners!!!')

@receiver(post_save, sender=Choice)
def postSaveChoice(sender, instance, created, **kwargs):
    if not created and instance.market.liquidated == 0:
        if instance.market.event.deadline < timezone.now() and instance.winner:
            m = instance.market
            m.liquidated = 1
            m.save()
            Channel("liquidate-market").send({
                "market_id": instance.market.id
            })

@receiver(post_save, sender=Market)
def postSaveMarket(sender, instance, created, **kwargs):
    if created:
        Choice.objects.create(market=instance, title="Sim", winner=False)
        Choice.objects.create(market=instance, title="Não", winner=False)
