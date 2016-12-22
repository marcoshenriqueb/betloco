from .models import EventType, EventCategory, Event, Market, Order
import random, string
from django.utils import timezone

class OrderFactory():
    """docstring for OrderFactory"""
    def __init__(self, events=10, multiple_events=10, orders_per_event=10):
        Event.objects.all().delete()
        EventType.objects.all().delete()
        EventType.objects.create(name='Binary')
        EventType.objects.create(name='Multiple')
        EventCategory.objects.all().delete()
        EventCategory.objects.create(name="General",code="GR")

    def createEvents(self, count=10):
        for n in range(count):
            title=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(40))
            e=Event.objects.create(
                title=title,
                user_id=1,
                event_type_id=1,
                event_category_id=1,
                trading_fee=0.5,
                description=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(100)),
                deadline=timezone.now()+timezone.timedelta(days=7)
            )
            Market.objects.create(
                title=title,
                title_short=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(15)),
                event=e
            )

    def createMultEvents(self, count=10):
        for n in range(count):
            e=Event.objects.create(
                title=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(40)),
                user_id=1,
                event_type_id=1,
                event_category_id=1,
                trading_fee=0.5,
                description=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(100)),
                deadline=timezone.now()+timezone.timedelta(days=7)
            )
            for _ in range(3):
                Market.objects.create(
                    title=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(30)),
                    title_short=''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(15)),
                    event=e
                )

    def createOrders(self, amount_per_market=4):
        for m in Market.objects.all():
            for _ in range(amount_per_market):
                price=round(random.uniform(0.01,0.99),2)
                Order.objects.create(market_id=m.id,user_id=1,price=price,amount=10)
                Order.objects.create(market_id=m.id,user_id=2,price=price,amount=-10)
