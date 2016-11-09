from rest_framework.test import APITestCase
from rest_framework import status

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
