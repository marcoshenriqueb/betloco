from django.views.generic.base import TemplateView
from django.views.generic import View
from django.shortcuts import render

class HomeView(TemplateView):
    """docstring for HomeView"""
    template_name = 'front/home.html'

class AppView(View):
    """docstring for AppView"""
    def get(self, request):
        if request.user.is_authenticated():
            context = {'user': request.user}
            return render(request, 'front/app.html', context=context)

        return render(request, 'front/home.html')
