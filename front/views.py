from django.views.generic import View
from django.shortcuts import render, redirect
from market.models import Market

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
            context = {'user': request.user.id}
        return render(request, 'front/app.html', context=context)

class ChooseWinnerView(View):
    """docstring for ChooseWinnerView"""
    def post(self, request):
        if request.user.is_staff:
            result = Market.objects.set_winner(request.POST['event-winner'])
            return redirect('/admin/market/event/' + request.POST['event-id'] + '/change/')
        return redirect('/')
