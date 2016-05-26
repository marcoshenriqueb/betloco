from django.conf.urls import url
from . import views


app_name = 'markets'
urlpatterns = [
    url(r'^$', views.ListMarkets.as_view()),
]
