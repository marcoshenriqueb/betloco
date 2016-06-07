from rest_framework import generics, filters
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction

class ListCreateTransaction(generics.ListCreateAPIView):
    """docstring for ListCreateTransaction"""
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class BalanceView(APIView):
    """docstring for BalanceView"""
    def get(self, request):
        return Response(Transaction.objects.balance('2'))
