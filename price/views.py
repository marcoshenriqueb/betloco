from rest_framework import generics
from .models import Price
from .serializers import PriceSerializer

class PriceView(generics.ListAPIView):
    """docstring for PriceView"""
    serializer_class = PriceSerializer

    def get_queryset(self):
        pk = self.request.query_params.get('market', None)
        if pk is None:
            return Price.objects.all()
        return Price.objects.filter(market=pk)
