from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PawsUpUser
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

class RegisterSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = PawsUpUser
        fields = ['email', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):

        try:
            account = PawsUpUser(
                email=self.validated_data['email'],
                first_name=self.validated_data['first_name'],
                last_name=self.validated_data['last_name'],
            )
        except:
            raise serializers.ValidationError({'error': 'Missing email, first_name, or last_name field'})

        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password': "Passwords must match."})

        account.set_password(password)
        account.save()
        return account

class LoginSerializer(serializers.Serializer):

    email = serializers.CharField()
    password = serializers.CharField()

    #Returns user as long as the account exists and is verified
    def validate(self, data):
        user = authenticate(**data)

        #Check if user was correctly logged in
        if user and user.is_active:
            
            #Checks if the account has been verified
            if user.is_email_verified:
                return user
            else:
                raise serializers.ValidationError("Account not activated")

        raise serializers.ValidationError("Incorrect Credentials")

class StoreLoginSerializer(serializers.Serializer):

    email = serializers.CharField()
    password = serializers.CharField()

    #Returns user as long as the account exists and is verified
    def validate(self, data):
        user = authenticate(**data)

        #Check if user was correctly logged in
        if user and user.is_active:
            
            #Checks if the account has been verified
            if user.is_store:
                return user
            else:
                raise serializers.ValidationError("Account not a store owner")

        raise serializers.ValidationError("Incorrect Credentials")

class GeneralUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = PawsUpUser
        fields = ('email', 'first_name', 'last_name')

class PersonalUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = PawsUpUser
        fields = ('email', 'first_name', 'last_name', 'password')

