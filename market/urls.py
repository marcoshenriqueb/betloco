from django.conf.urls import url
from . import views


app_name = 'markets'
urlpatterns = [
    url(r'^$', views.ListEvents.as_view()),
    url(r'^order/$', views.CreateOrder.as_view()),
    url(r'^custody/(?P<pk>[0-9]+)/$', views.CustodyView.as_view()),
    url(r'^open-orders/$', views.OpenOrdersView.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', views.DetailEvent.as_view()),
    url(r'^choice/(?P<pk>[0-9]+)/$', views.DetailMarket.as_view()),
    url(r'^my-positions/$', views.PlayerPositionsView.as_view()),
]
