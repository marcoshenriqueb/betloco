from rest_framework.views import APIView
from rest_framework import generics, filters
from rest_framework.response import Response
from .models import Market, Choice
from .serializers import MarketSerializer, MarketDetailSerializer, CreateOrderSerializer

class ListMarkets(generics.ListAPIView):
    """
    View to list all markets in the system.
    """
    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('title',)

class DetailMarket(generics.RetrieveAPIView):
    """
    View to list all markets in the system.
    """
    queryset = Market.objects.all()
    serializer_class = MarketDetailSerializer

class CreateOrder(generics.CreateAPIView):
    """docstring for CreateOrder"""
    serializer_class = CreateOrderSerializer
