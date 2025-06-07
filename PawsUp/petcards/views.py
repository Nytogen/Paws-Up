from django.shortcuts import render
from .models import PetCard
from rest_framework import serializers, viewsets, permissions
from .serializers import PetCardSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class PetCardList(APIView):
    #Adding a new pet card
        
    def post(self, request, format=None):
        serializer = PetCardSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            card = serializer.save(owner = request.user)
            data['response'] = "Successfully created Pet card"
            data['name'] = card.name
            data['age'] = card.age
            data['species'] = card.species
            data['breed'] = card.breed
            data['weight_lbs'] = card.weight_lbs
            data['gender'] = card.gender
            data['spayed_or_neutered'] = card.spayed_or_neutered
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    #See all pet cards
    def get(self, request):
        cards = PetCard.objects.all()
        serializer = PetCardSerializer(cards, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PetCardDetail(APIView):
    #Editing a specific pet card
    
    def patch(self, request, pk):
        try:
            card = PetCard.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 
        if(card.owner != request.user):
            return Response("This card does not belong to you.", status = status.HTTP_403_FORBIDDEN)

        serializer = PetCardSerializer(card, request.data, partial=True)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data['response'] = "Successfully updated Pet Card info"
            return Response(data, status=status.HTTP_206_PARTIAL_CONTENT)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        try:
            card = PetCard.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND)

        serializer = PetCardSerializer(instance = card)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk) :
        try:
            card = PetCard.objects.get(id=pk)
        except: 
            return Response(status = status.HTTP_404_NOT_FOUND) 
        if(card.owner != request.user):
            return Response(status = status.HTTP_403_FORBIDDEN)
        card.delete()
        return Response("Card deleted.", status = status.HTTP_204_NO_CONTENT)
    


