from django.db import models
from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from .models import PayoutID, PriceQuantity, Service, Price, addService, ServicePurchaseRecord, addServiceQuantity
from upload.models import ServiceVerificationFiles

class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = ['id', 'owner', 'name', 'service_type', 'service_start', 'service_end', 'address', 
        'details', 'checkInNotes', 'rating', 'paypal_id', 'verified_status']

class ServiceCreationSerializer(serializers.ModelSerializer):

    facilityList = ReadOnlyField()

    class Meta:
        model = Service
        fields = ['name', 'service_type', 'service_start', 'service_end', 'address', 'details', 'checkInNotes', 'facilityList', 'paypal_id']

class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ['pet_type', 'price']

class RatingSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value = 1, max_value = 5)

class PayOutSerializer(serializers.ModelSerializer):

    class Meta:
        model = PayoutID
        fields = ['payoutID']

class addServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = addService
        fields = ['name', 'price']

class ServicePurchaseRecordSerializer(serializers.ModelSerializer):

    id = ReadOnlyField()

    class Meta:
        model = ServicePurchaseRecord
        fields = ['id', 'service', 'customer', 'total_price', 'start_date', 'end_date', 'approval_time']


class PriceQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceQuantity
        fields = ['pet_type', 'quantity']

class addServiceQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = addServiceQuantity
        fields = ['name', 'quantity']

class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceVerificationFiles
        fields = ['file']
        
