from rest_framework import serializers
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

class SocialSerializer(serializers.ModelSerializer):
    """docstring for UserSerializer"""
    class Meta:
        model = SocialAccount
        fields = (
            'extra_data',
            'uid',
            'provider'
        )

class UserSerializer(serializers.ModelSerializer):
    """docstring for UserSerializer"""
    socialaccount_set = SocialSerializer(many=True)
    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'last_login',
            'date_joined',
            'socialaccount_set'
        )
