from django.views.generic import View
from django.shortcuts import render, redirect
from market.models import Market

class HomeView(View):
    """docstring for HomeView"""
    def get(self, request):
        if not request.user.is_authenticated():
            return render(request, 'front/home.html')

        return redirect('/app/')

class AppView(View):
    """docstring for AppView"""
    def get(self, request):
        if request.user.is_authenticated():
            context = {'user': request.user}
            return render(request, 'front/app.html', context=context)

        return redirect('/')

class ChooseWinnerView(View):
    """docstring for ChooseWinnerView"""
    def post(self, request):
        if request.user.is_staff:
            result = Market.objects.set_winner(request.POST['event-winner'])
            return redirect('/admin/market/event/' + request.POST['event-id'] + '/change/')
        return redirect('/')
