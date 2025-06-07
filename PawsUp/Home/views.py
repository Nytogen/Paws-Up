from Home.models import Counter
from rest_framework import serializers, viewsets, permissions
from .serializers import LeadSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#Lead Viewsets
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Counter.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = LeadSerializer


