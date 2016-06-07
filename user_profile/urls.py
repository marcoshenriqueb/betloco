from django.conf.urls import url
from . import views


app_name = 'userProfile'
urlpatterns = [
    url(r'^me/$', views.UserMe.as_view()),
]
