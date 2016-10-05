import redis
from django.conf import settings
from market.models import Market
from market.serializers import MarketDetailSerializer
import json

class RedisChannel():
    """docstring for RedisChannel"""
    def __init__(self):
        self.redis = redis.Redis(settings.REDIS_URL.hostname, settings.REDIS_URL.port, 0)

    def publishMarketUpdate(self, key):
        m = Market.objects.get(pk=int(key))
        mserializer = MarketDetailSerializer(m)
        data = {
            'market': mserializer.data
        }
        self.redis.publish('guroo:market:update', json.dumps(data))

class Channel(RedisChannel):
    """docstring for RedisChannel"""
    def __init__(self):
        super().__init__()
