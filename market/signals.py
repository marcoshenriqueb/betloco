from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from engine.engine import OrderEngine
from channels import Channel
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
