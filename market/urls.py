from django.conf.urls import url
from . import views


app_name = 'markets'
urlpatterns = [
    url(r'^$', views.ListMarkets.as_view()),
    url(r'^order/$', views.CreateOrder.as_view()),
    url(r'^custody/(?P<pk>[0-9]+)/$', views.CustodyView.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', views.DetailMarket.as_view()),
]
