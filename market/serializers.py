from rest_framework import serializers
from .models import Market, Choice, MarketType, MarketCategory, Order, Operation, Sum
from transaction.models import Transaction

class OrderSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Order
        fields = ('id', 'user', 'price', 'amount')

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
        )

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

class CreateOrderSerializer(serializers.ModelSerializer):
    """docstring for CreateOrderSerializer"""
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    choice = serializers.PrimaryKeyRelatedField(queryset=Choice.objects.all())
    class Meta:
        model = Order
        fields = ('price', 'amount', 'user', 'choice')

    def validate(self, data):
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
                             .aggregate(pending=Sum('amount'))['pending'] or 0
            o *= -1
            # Don't let user sell more than he has plus the orders already sent
            if (c[data['choice'].id]['position'] - o) < (data['amount'] * (-1)):
                raise serializers.ValidationError("Can't sell more than you have plus orders already sent!")
        # Validates buy orders
        elif data['amount'] > 0:
            balance = Transaction.objects.balance(self.context['request'].user.id)
            if data['amount']*data['price'] > balance:
                raise serializers.ValidationError("Not enough cash to place the order!")

        return data

    def create(self, validated_data):
        return Order.objects.create(
            user=self.context['request'].user,
            price=validated_data['price'],
            amount=validated_data['amount'],
            choice=validated_data['choice']
        )
