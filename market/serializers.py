from rest_framework import serializers
from .models import Event, Market, Choice, EventType, EventCategory, Order, Operation, Sum, Q
from transaction.models import Transaction
from django.utils import timezone

class OrderSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Order
        fields = ('price', 'amount')

class SimpleChoiceSerializer(serializers.ModelSerializer):
    lastCompleteOrder = OrderSerializer()
    class Meta:
        model = Choice
        fields = ('id', 'title', 'lastCompleteOrder')

class ChoiceSerializer(serializers.ModelSerializer):
    topBuys = OrderSerializer(many=True)
    topSells = OrderSerializer(many=True)
    lastCompleteOrder = OrderSerializer()

    class Meta:
        model = Choice
        fields = ('id', 'title', 'topBuys', 'topSells', 'lastCompleteOrder')

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ('id', 'name', 'code')

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ('id', 'name',)

class MarketSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Market
        fields = (
            'id',
            'title',
            'title_short',
            'choices',
            'volume'
        )

class EventSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    event_type = serializers.StringRelatedField()
    event_category = EventCategorySerializer()
    markets = MarketSerializer(many=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'title',
            'user',
            'event_type',
            'event_category',
            'volume',
            'deadline',
            'markets',
            'created_at'
        )

class MarketDetailSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)
    event = EventSerializer()

    class Meta:
        model = Market
        fields = (
            'id',
            'event',
            'title',
            'title_short',
            'choices',
            'volume'
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
    choice = serializers.PrimaryKeyRelatedField(queryset=Choice.objects.all())
    class Meta:
        model = Order
        fields = ('price', 'amount', 'user', 'choice')

    def validate(self, data):
        if data['choice'].market.event.deadline < timezone.now():
            raise serializers.ValidationError("Market has ended already!")
        user_id = self.context['request'].user.id
        # Validates sell orders
        if data['amount'] < 0:
            c = Choice.objects.custody(user_id, data['choice'].market.id, data['choice'].id)
            # Don't let user sell more than what he has
            if c[data['choice'].id]['position'] < (data['amount'] * (-1)):
                raise serializers.ValidationError("Can't sell more than you have!")
            o = Order.objects.filter(user__id=self.context['request'].user.id) \
                             .filter(choice__id=data['choice'].id) \
                             .filter(from_order__isnull=True) \
                             .filter(to_order__isnull=True) \
                             .filter(amount__lt=0) \
                             .filter(deleted=0) \
                             .aggregate(pending=Sum('amount'))['pending'] or 0
            o *= -1
            # Don't let user sell more than he has plus the orders already sent
            if (c[data['choice'].id]['position'] - o) < (data['amount'] * (-1)):
                raise serializers.ValidationError("Can't sell more than you have plus orders already sent!")
        # Validates buy orders
        elif data['amount'] > 0:
            c = Choice.objects.custody(user_id, data['choice'].market.id, not_choice_id=data['choice'].id)
            for k, v in c.items():
                if int(v['position']) > 0:
                    raise serializers.ValidationError("You can't bet against yourself!")

            o = Order.objects.getOpenOrders(user_id, data['choice'].market.id) \
                                .filter(~Q(choice__id=data['choice'].id)).count()
            if o > 0:
                raise serializers.ValidationError("Can't place bets on both Yes and No!")
        balance = Transaction.objects.balance(self.context['request'].user.id, new_order=data)
        if balance['total'] < 0:
            raise serializers.ValidationError("Not enough cash to place the order!")

        return data

    def create(self, validated_data):
        return Order.objects.create(
            user=self.context['request'].user,
            price=validated_data['price'],
            amount=validated_data['amount'],
            choice=validated_data['choice']
        )
