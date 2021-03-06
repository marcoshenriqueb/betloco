from django.conf.urls import url
from . import views

app_name = 'markets'
urlpatterns = [
    url(r'^$', views.AppView.as_view()),
    url(r'^perfil/minhas-posicoes/$', views.AppView.as_view()),
    url(r'^perfil/minhas-ordens/$', views.AppView.as_view()),
    url(r'^perfil/minhas-configuracoes/$', views.AppView.as_view()),
    url(r'^perfil/historico-transacoes/$', views.AppView.as_view()),
    url(r'^perfil/fundos/$', views.AppView.as_view()),
    url(r'^mercado/[0-9]+/$', views.AppView.as_view()),
    url(r'^evento/[0-9]+/$', views.AppView.as_view()),
]
