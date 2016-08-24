from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer

class UserMe(APIView):
    """docstring for UserMe"""
    def get(self, request):
        if request.user.is_authenticated():
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        return Response(False)
