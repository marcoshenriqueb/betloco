from rest_framework import serializers
from .models import Market, Choice, MarketType, MarketCategory, Order, Operation

class SimpleChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'title')

class OrderSerializer(serializers.ModelSerializer):
    choice = SimpleChoiceSerializer()

    class Meta:
        model = Order
        fields = ('id', 'price', 'amount', 'choice')

class OperationSerializer(serializers.ModelSerializer):
    from_order = OrderSerializer()
    to_order = OrderSerializer()

    class Meta:
        model = Operation
        fields = ('id', 'price', 'amount', 'from_order', 'to_order')

class ChoiceSerializer(serializers.ModelSerializer):
    order_set = OrderSerializer(many=True)

    class Meta:
        model = Choice
        fields = ('id', 'title', 'order_set')

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
    choices = SimpleChoiceSerializer(many=True)
    lastCompleteOrder = OperationSerializer()

    class Meta:
        model = Market
        fields = (
            'id',
            'title',
            'market_type',
            'market_category',
            'trading_fee',
            'volume',
            'deadline',
            'choices',
            'lastCompleteOrder'
        )

class MarketDetailSerializer(serializers.ModelSerializer):
    market_type = MarketTypeSerializer()
    user = serializers.StringRelatedField()
    market_category = MarketCategorySerializer()
    choices = ChoiceSerializer(many=True)
    lastCompleteOrder = OperationSerializer()

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
            'lastCompleteOrder',
            'deadline',
            'created_at'
        )
