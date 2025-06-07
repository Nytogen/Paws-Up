from rest_framework import serializers
from Home.models import Counter
#Lead Serializer
class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = '__all__'

