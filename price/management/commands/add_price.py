from django.core.management.base import BaseCommand, CommandError
from market.models import Market
from django.utils import timezone
from datetime import timedelta
from price.models import Price

class Command(BaseCommand):
    help = 'Add last day prices'

    def handle(self, *args, **options):
        markets = Market.objects.all()
        for m in markets:
            if m.lastCompleteOrder is not None and m.liquidated == 0:
                time = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
                if len(Price.objects.filter(market__id=m.id).filter(date__gte=time)) == 0:
                    o = m._getLastCompleteOrder(until=time)
                    if o is not None:
                        Price.objects.create(
                            market=m,
                            date=time,
                            price=o.price
                        )
