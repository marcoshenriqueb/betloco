from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views
from front.views import ChooseWinnerView, HomeView, LetsEncView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.schemas import get_schema_view

schema_view = get_schema_view(title='Guroo API')

urlpatterns = [
    url(r'^custom-admin/choose-winner/$', ChooseWinnerView.as_view()),
    url(r'^admin/', admin.site.urls),
    url(r'^app/', include('front.urls')),
    url(r'^accounts/logout/$', views.logout, {'next_page': '/'}),
    url(r'^api/schema/', schema_view),
    url(r'^api/markets/', include('market.urls')),
    url(r'^api/users/', include('user_profile.urls')),
    url(r'^api/transactions/', include('transaction.urls')),
    url(r'^api/prices/', include('price.urls')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^.well-known/acme-challenge/(?P<pk>.+)/$', LetsEncView.as_view()),
    url(r'^$', HomeView.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

