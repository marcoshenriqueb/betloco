from django.views.generic import View
from django.http import HttpResponse
from django.shortcuts import render, redirect
from market.models import Market
from django.conf import settings

class HomeView(View):
    """docstring for HomeView"""
    def get(self, request):
        if request.user.is_authenticated():
            return redirect('/app/')
        return render(request, 'front/home.html')

class AppView(View):
    """docstring for AppView"""
    def get(self, request):
        context = {'user': 'anom'}
        if request.user.is_authenticated():
            context = {'user': request.user.id, 'socket_url': settings.SOCKET_URL}
        return render(request, 'front/app.html', context=context)

class ChooseWinnerView(View):
    """docstring for ChooseWinnerView"""
    def post(self, request):
        if request.user.is_staff:
            market_id = request.POST['market-id'] if 'market-id' in request.POST else False
            result = Market.objects.set_winner(request.POST['event-winner'], market_id=market_id)
            return redirect('/admin/market/event/' + request.POST['event-id'] + '/change/')
        return redirect('/')

class LetsEncView(View):
    """docstring for LetsEncView"""
    def get(self, request, pk):
        return HttpResponse(pk + '.' + settings.LETS_ENCRYPT_KEY)
