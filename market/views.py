from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from .models import Market, Choice
from .serializers import MarketSerializer

class ListMarkets(generics.ListAPIView):
    """
    View to list all markets in the system.

    * Requires token authentication.
    """
    queryset = Market.objects.all()
    serializer_class = MarketSerializer
