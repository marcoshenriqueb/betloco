from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from market.models import Event, Market, EventType, EventCategory, Order
from django.utils import timezone

class TransactionRequestsBalanceTests(APITestCase):
    """Test transaction balance api endpoint"""
    def setUp(self):
        u = User.objects.create_user(username="test", password="Test123456")
        u2 = User.objects.create_user(username="test2", password="Test123456")
        t = EventType.objects.create(name="Binary")
        c = EventCategory.objects.create(name="General",code="GR")
        e = Event.objects.create(
            title="Guroo's test will pass?",
            user=u,
            event_type=t,
            event_category=c,
            trading_fee=0.5,
            description="Any description!",
            deadline=timezone.now()+timezone.timedelta(days=7)
        )
        m = Market.objects.create(
            title="Guroo's test will pass?",
            title_short="Guroo passes?",
            event=e
        )

    def test_get_balance_no_credentials(self):
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total'], 0)
        self.assertEqual(response.data['risk'], 0)
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 0)

    def test_get_balance_before_any_order(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total'], 10000)
        self.assertEqual(response.data['risk'], 0)
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_buy_order(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=100)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], 100*0.5)
        self.assertEqual(response.data['total'], 10000-(100*0.5))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_buy_order_completed(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=-100)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], 100*0.5)
        self.assertEqual(response.data['total'], 10000-(100*0.5))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_smaller_than_first_buy(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=-50)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], 100*0.5)
        self.assertEqual(response.data['total'], 10000-(100*0.5))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_completed_smaller_than_first_buy(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=-50)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=50)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], (100*0.5)-(50*0.5))
        self.assertEqual(response.data['total'], 10000-((100*0.5)-(50*0.5)))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_bigger_than_first_buy(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=-300)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], -(100*0.5)+(300*0.5))
        self.assertEqual(response.data['total'], 10000-((300*0.5)-(100*0.5)))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_completed_bigger_than_first_buy(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.5,amount=-300)
        Order.objects.create(market_id=1,user_id=2,price=0.5,amount=300)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], -(100*0.5)+(300*0.5))
        self.assertEqual(response.data['total'], 10000-((300*0.5)-(100*0.5)))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_smaller_than_first_buy_with_different_price(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.4,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.4,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.6,amount=-50)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], 100*0.4)
        self.assertEqual(response.data['total'], 10000-(100*0.4))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_completed_smaller_than_first_buy_with_different_price(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.4,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.4,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.6,amount=-50)
        Order.objects.create(market_id=1,user_id=2,price=0.6,amount=50)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], (100*0.4)-(50*0.6))
        self.assertEqual(response.data['total'], 10000-((100*0.4)-(50*0.6)))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_bigger_than_first_buy_with_different_price(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.4,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.4,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.6,amount=-300)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], 200*(1-0.6))
        self.assertEqual(response.data['total'], 10000-(200*(1-0.6)))
        self.assertEqual(response.data['balance'], 0)
        self.assertEqual(response.data['transactions'], 10000)

    def test_get_balance_after_sell_order_completed_bigger_than_first_buy_with_different_price(self):
        self.client.login(username='test', password='Test123456')
        Order.objects.create(market_id=1,user_id=1,price=0.4,amount=100)
        Order.objects.create(market_id=1,user_id=2,price=0.4,amount=-100)
        Order.objects.create(market_id=1,user_id=1,price=0.6,amount=-300)
        Order.objects.create(market_id=1,user_id=2,price=0.6,amount=300)
        response = self.client.get('/api/transactions/balance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['risk'], 200*(1-0.6))
        self.assertEqual(response.data['total'], 10000-(200*(1-0.6))+((100*0.6)-(100*0.4)))
        self.assertEqual(response.data['balance'], (100*0.6)-(100*0.4))
        self.assertEqual(response.data['transactions'], 10000)
