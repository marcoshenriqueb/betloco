from rest_framework import serializers
from .models import Event, Market, EventType, EventCategory, Order, Operation, Sum, Q
from transaction.models import Transaction
from django.utils import timezone

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('price', 'amount')

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ('id', 'name', 'code')

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ('id', 'name',)

class MarketSerializer(serializers.ModelSerializer):
    lastCompleteOrder = OrderSerializer()
    
    class Meta:
        model = Market
        fields = (
            'id',
            'title_short',
            'volume',
            'lastCompleteOrder',
            'lastDayPrice'
        )

class EventSerializer(serializers.ModelSerializer):
    event_category = EventCategorySerializer()
    markets = MarketSerializer(many=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'title',
            'event_category',
            'volume',
            'deadline',
            'markets',
            'created_at'
        )

class MarketDetailSerializer(serializers.ModelSerializer):
    event = EventSerializer()
    topBuys = OrderSerializer(many=True)
    topSells = OrderSerializer(many=True)
    lastCompleteOrder = OrderSerializer()

    class Meta:
        model = Market
        fields = (
            'id',
            'event',
            'title',
            'title_short',
            'volume',
            'topBuys',
            'topSells',
            'lastCompleteOrder',
            'lastDayPrice'
        )

class EventDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    event_type = EventTypeSerializer()
    event_category = EventCategorySerializer()
    markets = MarketSerializer(many=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'user',
            'title',
            'description',
            'event_type',
            'event_category',
            'volume',
            'markets',
            'deadline',
            'created_at'
        )

class CreateOrderSerializer(serializers.ModelSerializer):
    """docstring for CreateOrderSerializer"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    market = serializers.PrimaryKeyRelatedField(queryset=Market.objects.all())
    class Meta:
        model = Order
        fields = ('price', 'amount', 'user', 'market')

    def validate(self, data):
        if data['market'].event.deadline < timezone.now():
            raise serializers.ValidationError("Esse mercado está encerrado!")
        user_id = self.context['request'].user.id
        # Validates sell orders
        balance = Transaction.objects.balance(self.context['request'].user.id, new_order=data)
        if balance['total'] < 0:
            raise serializers.ValidationError("Você não tem saldo suficiente!")
        if data['price'] == 0 or data['price'] >= 1:
            raise serializers.ValidationError("Por favor, passe um preço válido.")
        if data['amount'] == 0 or type(data['amount']) is not int:
            raise serializers.ValidationError("Por favor, passe uma quantidade válida.")
        return data

    def create(self, validated_data):
        return Order.objects.create(
            user=self.context['request'].user,
            price=validated_data['price'],
            amount=validated_data['amount'],
            market=validated_data['market']
        )
