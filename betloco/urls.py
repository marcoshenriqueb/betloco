from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views
from front.views import AppView, HomeView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', HomeView.as_view()),
    url(r'^app/$', AppView.as_view()),
    url(r'^accounts/logout/$', views.logout, {'next_page': '/'}),
    url(r'^api/markets/', include('market.urls')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
