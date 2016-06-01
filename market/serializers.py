from rest_framework import serializers
from .models import Market, Choice, MarketType, MarketCategory, Operation
from django.db.models import Sum, Q

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'title',)

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
        fields = ('id', 'title', 'market_type', 'market_category', 'trading_fee', 'deadline', 'choices')

class MarketDetailSerializer(serializers.ModelSerializer):
    market_type = MarketTypeSerializer()
    user = serializers.StringRelatedField()
    market_category = MarketCategorySerializer()
    choices = ChoiceSerializer(many=True)
    # volume = serializers.SerializerMethodField('getVolume')
    #
    # def getVolume(self, obj):
    #     q1 = Q(from_order__choice__id=1) | Q(to_order__choice__id=2)
    #     return Operation.objects.filter(q1) \
    #                     .aggregate(Sum('amount'))['amount__sum']

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
            'choices',
            'deadline',
            'created_at'
        )
