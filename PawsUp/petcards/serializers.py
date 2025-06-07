from rest_framework import serializers
from .models import PetCard

class PetCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetCard
        fields = ['id', 'name', 'age', 'species', 'breed', 'weight_lbs', 'gender', 'spayed_or_neutered']
    
    