from rest_framework.views import APIView
from rest_framework import generics, filters
from rest_framework.response import Response
from .models import Event, Market, Choice, Order
from .serializers import ChoiceSerializer, MarketDetailSerializer, EventSerializer, EventDetailSerializer, CreateOrderSerializer
from .search import ElasticSearch
from channels import Channel
import json

class ListEvents(APIView):
    """
    View to list all events in the system.
    """
    def get(self, request):
        es = ElasticSearch()
        query = None
        if 'query' in request.query_params:
            query = request.query_params['query']
        if 'page' not in request.query_params:
            return Response(es.search(query))
        return Response(es.search(query, page=request.query_params['page']))

class DetailEvent(generics.RetrieveAPIView):
    """
    View to list all events in the system.
    """
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer

class DetailMarket(generics.RetrieveAPIView):
    """
    View to list all events in the system.
    """
    queryset = Market.objects.all()
    serializer_class = MarketDetailSerializer

class CreateOrder(generics.CreateAPIView):
    """docstring for CreateOrder"""
    serializer_class = CreateOrderSerializer

class CustodyView(APIView):
    """Show user custody"""
    def get(self, request, pk):
        return Response(Choice.objects.custody(request.user.id, pk))

class OpenOrdersView(APIView):
    """Show user open orders"""
    def get(self, request):
        market = None
        if 'market' in request.query_params:
            market = request.query_params['market']
        return Response(Order.objects.getOpenOrders(request.user.id, market))

    def delete(self, request):
        Order.objects.deleteOpenOrders(request.user.id, json.loads(request.query_params['orders']))
        market = None
        if 'market' in request.query_params:
            market = request.query_params['market']
            Channel("market-update").send({
                "room": 'market-' + str(market),
                "message": json.dumps({'pk': str(market)})
            })

        return Response(True)

class PlayerPositionsView(APIView):
    """docstring for PlayerPositionsView"""
    def get(self, request):
        positions = Order.objects.getPlayerPositions(request.user.id)
        return Response(positions)

class PlayerHistoryView(APIView):
    """docstring for PlayerHistoryView"""
    def get(self, request):
        history = Order.objects.getPlayerHistory(request.user.id)
        return Response(history)
