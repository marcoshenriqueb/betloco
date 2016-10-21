from rest_framework import generics, filters
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction
from .payments import Paypal
import json

class ListCreateTransaction(generics.ListAPIView):
    """docstring for ListTransaction"""
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class BalanceView(APIView):
    """docstring for BalanceView"""
    def get(self, request):
        preview = None
        if 'preview' in request.query_params:
            preview = json.loads(request.query_params['preview'])
        return Response(Transaction.objects.balance(request.user.id, new_order=preview))

class CheckoutView(APIView):
    """docstring for CheckoutView"""
    def post(self, request):
        p = Paypal(request.data)
        p.create()
        return Response(request.data['value'])
