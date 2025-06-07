from service.models import Service
from service.serializers import ServiceSerializer
from petcards.serializers import PetCardSerializer
from petcards.models import PetCard
from .models import PawsUpUser
from rest_framework import status
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework import permissions

from .serializers import GeneralUserSerializer, PersonalUserSerializer, RegisterSerializer, LoginSerializer, GeneralUserSerializer, PersonalUserSerializer, StoreLoginSerializer
from rest_framework.authtoken.models import Token
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from rest_framework.authtoken.models import Token
from .permissions import IsOwnerOrReadOnly

#Creates a new user in the database.
class RegisterAPI(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):

        serializer = RegisterSerializer(data=request.data)

        data = {}

        #Checks if all the correct info is given
        serializer.is_valid(raise_exception=True)
        #Adds the info to the database
        account = serializer.save()

        #Construct the response
        data['response'] = "Successfully registered a new user. Please go to your email to verify the account."
        token = Token.objects.get(user=account).key
        data['token'] = token

        #The base site url, in our testing its probs localhost:8000 
        current_site = get_current_site(request).domain
        #The path to get to the email-verify path, probably is api/accounts/email-verify
        relative_link = reverse("email-verify")

        #Builds the full url with the token at the end
        absurl = 'http://' + current_site + relative_link + "?token=" + token

        #Send the email with the link.
        try:
            send_mail("PawsUp Account Verification", "Hello " + account.first_name + " " + account.last_name + ", please click this link to verify your account. \n" + absurl, "pawsuptest@gmail.com", [account.email], fail_silently=False)
        except:
            account.delete()
            return Response(data={'error': 'account is created but email not sending somehow'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data=data, status=status.HTTP_201_CREATED)


#Updates the user associated with the token given in the URL to be email_verified.
class VerifyEmailAPI(APIView):

    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):

        #Get token from url, should be after ?token
        token = request.GET.get('token')

        #Try to find the user with that token, if not, give error
        try:
            user = Token.objects.get(key=token).user
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        #Set the user to verified and save the change
        user.is_email_verified = True
        user.save()

        return Response(status=status.HTTP_202_ACCEPTED)

#Checks the credentials of the input and returns a token if successful
class LoginAPI(APIView):

    def post(self, request, format=None):

        #Checks the data and gets an account with the given info.
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data

        #Get the corresponding token from the database
        token = Token.objects.get(user=account).key

        #Build the return data
        data = {}
        data['id'] = account.id
        data['token'] = token

        return Response(data=data, status=status.HTTP_200_OK)

#Checks the credentials of the input and returns a token if successful
class StoreLoginAPI(APIView):

    def post(self, request, format=None):

        #Checks the data and gets an account with the given info.
        serializer = StoreLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data

        #Get the corresponding token from the database
        token = Token.objects.get(user=account).key

        return Response(data={'token': token}, status=status.HTTP_200_OK)

class UserList(APIView):
    #See all users
    def get(self, request):
        users = PawsUpUser.objects.all()
        serializer = GeneralUserSerializer(users, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetail(APIView):

    permission_classes = [
        IsOwnerOrReadOnly
    ]

    #Edit info for a specific user
    def patch(self, request, pk):
        try:
            user = PawsUpUser.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND)

        if(not IsOwnerOrReadOnly.has_obj_permission(request=request, obj=user)):
            return Response(status = status.HTTP_403_FORBIDDEN)

        serializer = PersonalUserSerializer(user, request.data, partial=True)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data['response'] = "Successfully updated User info"
            return Response(data, status=status.HTTP_206_PARTIAL_CONTENT)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    #See a specific user
    def get(self, request, pk):

        try:
            user = PawsUpUser.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND)

        serializer = GeneralUserSerializer(user)
        return Response(serializer.data, status = status.HTTP_200_OK)

class ProfileOverview(APIView):

    def get(self, request, pk):
        try:
            user = PawsUpUser.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND)
        
        serializer = GeneralUserSerializer(user)
            
        pet_cards = PetCard.objects.filter(owner=pk)
        pet_serializer = PetCardSerializer(pet_cards, many=True)
        services = Service.objects.filter(owner=pk)
        service_serializer = ServiceSerializer(services, many=True)


        data = {"user": serializer.data, "pet_cards": pet_serializer.data, "services":service_serializer.data}
        return Response(data, status=status.HTTP_202_ACCEPTED)