from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from .models import Market, Choice
from .serializers import MarketSerializer, MarketDetailSerializer

class ListMarkets(generics.ListAPIView):
    """
    View to list all markets in the system.
    """
    queryset = Market.objects.all()
    serializer_class = MarketSerializer

class DetailMarket(generics.RetrieveAPIView):
    """
    View to list all markets in the system.
    """
    queryset = Market.objects.all()
    serializer_class = MarketDetailSerializer
