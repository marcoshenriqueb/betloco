from django.core.management.base import BaseCommand, CommandError
from market.models import Market
from django.utils import timezone
from datetime import timedelta
from price.models import Price

class Command(BaseCommand):
    help = 'Create table of historic prices'

    def handle(self, *args, **options):
        Price.objects.all().delete()
        markets = Market.objects.all()
        for m in markets:
            if m.lastCompleteOrder is not None and m.liquidated == 0:
                for k in range(90):
                    until = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=k)
                    o = m._getLastCompleteOrder(until=until)
                    if o is not None:
                        Price.objects.create(
                            market=m,
                            date=until,
                            price=o.price
                        )
