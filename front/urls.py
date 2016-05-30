from django.conf.urls import url
from . import views

app_name = 'markets'
urlpatterns = [
    url(r'^$', views.AppView.as_view()),
    url(r'^perfil/$', views.AppView.as_view()),
    url(r'^mercado/[0-9]+/$', views.AppView.as_view()),
]
