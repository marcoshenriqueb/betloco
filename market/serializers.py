from rest_framework import serializers
from .models import Market, Choice, MarketType, MarketCategory, Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'price', 'amount')

class ChoiceSerializer(serializers.ModelSerializer):
    order_set = OrderSerializer(many=True)
    lastPrice = OrderSerializer(many=True)

    class Meta:
        model = Choice
        fields = ('id', 'title', 'order_set', 'lastPrice')

class MarketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketCategory
        fields = ('id', 'name',)

class MarketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketType
        fields = ('id', 'name',)

class MarketSerializer(serializers.ModelSerializer):
    market_type = serializers.StringRelatedField()
    market_category = serializers.StringRelatedField()
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Market
        fields = ('id', 'title', 'market_type', 'market_category', 'trading_fee', 'volume', 'deadline', 'choices')

class MarketDetailSerializer(serializers.ModelSerializer):
    market_type = MarketTypeSerializer()
    user = serializers.StringRelatedField()
    market_category = MarketCategorySerializer()
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Market
        fields = (
            'id',
            'user',
            'title',
            'description',
            'market_type',
            'market_category',
            'trading_fee',
            'volume',
            'choices',
            'deadline',
            'created_at'
        )
