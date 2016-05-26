from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Market, Choice

class ListMarkets(APIView):
    """
    View to list all markets in the system.

    * Requires token authentication.
    """
    def get(self, request):
        """
        Return a list of all markets.
        """
        markets = [market.title for market in Market.objects.all()]
        return Response(markets)
