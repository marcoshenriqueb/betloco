from rest_framework.views import APIView
from rest_framework import generics, filters
from rest_framework.response import Response
from .models import Event, Market, Order
from .serializers import MarketDetailSerializer, EventSerializer, EventDetailSerializer, CreateOrderSerializer
from .search import ElasticSearch
from betloco.publish import Channel
from rest_framework.permissions import IsAuthenticated
import json

class ListEvents(APIView):
    """
    View to list all events in the system.
    """
    def get(self, request):
        es = ElasticSearch()
        query = None if 'query' not in request.query_params else request.query_params['query']
        page = 0 if 'page' not in request.query_params else request.query_params['page']
        expired = False if 'expired' not in request.query_params else request.query_params['expired']
        category = 'todas' if 'category' not in request.query_params else request.query_params['category']
        order = '_score|desc' if 'order' not in request.query_params else request.query_params['order']
        return Response(es.search(query, page=page, expired=expired, order=order, category=category))

class ListEventsPrices(APIView):
    """docstring for ListEventsPrices"""
    def post(self, request):
        if 'ids' in request.data:
            if type(request.data['ids']) is str:
                try:
                    ids = json.loads(request.data['ids'])
                except ValueError:
                    return Response("The string is not in the correct format", status=400)
            elif type(request.data['ids']) is list:
                ids = request.data['ids']
            else:
                return Response("Id's data type is not correct", status=400)
            return Response(Market.objects.getSearchPrices(ids))

        return Response("Didn't submit markets id's!", status=400)

class CreateOrder(generics.CreateAPIView):
    """docstring for CreateOrder"""
    serializer_class = CreateOrderSerializer
    permission_classes = (IsAuthenticated,)

class CustodyView(APIView):
    """Show user custody"""
    def get(self, request, pk):
        return Response(Market.objects.custody(request.user.id, pk))

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
            c = Channel()
            c.publishMarketUpdate(market)

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
