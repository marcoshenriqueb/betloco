from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Event, Market, EventType, EventCategory
from django.utils import timezone

class MarketRequestsEventsTests(APITestCase):
    """Test market events search api endpoints"""

    def test_get_events_list_simple(self):
        response = self.client.get('/api/markets/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(type(response.data), dict)

    # Testar repostas iguais para parametros diferentes

class MarketRequestsPricesTests(APITestCase):
    """Test market prices api endpoint"""

    def test_get_events_prices_no_ids(self):
        response = self.client.post('/api/markets/prices/', {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(type(response.data), str)

    def test_get_events_prices_with_ids_wrong_data_type(self):
        response = self.client.post('/api/markets/prices/', {
                                                            "ids": True
                                                        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(type(response.data), str)

    def test_get_events_prices_with_ids_string_formated_wrong(self):
        response = self.client.post('/api/markets/prices/', {
                                                            "ids": "foo,bar"
                                                        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(type(response.data), str)

    def test_get_events_prices_with_ids_string_formated(self):
        response = self.client.post('/api/markets/prices/', {
                                                            "ids": "[7,8,9]"
                                                        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_get_events_prices_with_ids_list_formated(self):
        response = self.client.post('/api/markets/prices/', {
                                                            "ids": [7,8,9]
                                                        }, format='json')
        self.assertEqual(response.status_code, 200)

class MarketRequestsOrdersTests(APITestCase):
    """Test market orders api endpoint"""
    def setUp(self):
        u = User.objects.create_user(username="test", password="Test123456")
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

    def test_post_new_order_no_credentials(self):
        response = self.client.post('/api/markets/order/', {}, format='json')
        self.assertEqual(response.status_code, 403)

    def test_post_new_order_no_data(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_no_amount(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'market': 1,
            'price': 0.5
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_no_price(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'market': 1,
            'amount': 100
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_no_market(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'price': 0.5,
            'amount': 100
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_price_equal_zero(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'price': 0,
            'market': 1,
            'amount': 100
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_price_bigger_equal_one(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'price': 1,
            'market': 1,
            'amount': 100
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_amount_equal_zero(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'price': 0.5,
            'market': 1,
            'amount': 0
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_amount_not_integer(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'price': 0.5,
            'market': 1,
            'amount': 10.5
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_post_new_order_ok(self):
        self.client.login(username='test', password='Test123456')
        response = self.client.post('/api/markets/order/', {
            'price': 0.5,
            'market': 1,
            'amount': 10
        }, format='json')
        self.assertEqual(response.status_code, 201)
        # print(response.status_code)
        # print(response.data)
