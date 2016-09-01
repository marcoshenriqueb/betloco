from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from transaction.models import Transaction

@receiver(post_save, sender=User)
def postSaveUser(sender, instance, created, **kwargs):
    if created:
        Transaction.objects.create(
            user=instance,
            transaction_type_id=1,
            value=10000
        )
