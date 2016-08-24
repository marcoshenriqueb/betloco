from django.conf.urls import url
from . import views


app_name = 'transactions'
urlpatterns = [
    url(r'^$', views.ListCreateTransaction.as_view()),
    url(r'^balance/$', views.BalanceView.as_view()),
]
