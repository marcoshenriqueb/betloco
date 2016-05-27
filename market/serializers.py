from rest_framework import serializers
from .models import Market, Choice, MarketType

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'title',)

class MarketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketType
        fields = ('id', 'name',)

class MarketSerializer(serializers.ModelSerializer):
    market_type = serializers.StringRelatedField()
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Market
        fields = ('id', 'title', 'market_type', 'trading_fee', 'deadline', 'choices')
