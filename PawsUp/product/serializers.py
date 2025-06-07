from django.db import models
from rest_framework import serializers
from .models import Product, ProductPurchaseRecord
from rest_framework.fields import ReadOnlyField


class ProductSerializer(serializers.ModelSerializer):

    id = ReadOnlyField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image']

class ProductCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'image']

class ProductPurchaseRecordSerializer(serializers.ModelSerializer):

    id = ReadOnlyField()
    class Meta:
        model = ProductPurchaseRecord
        fields = ['id', 'customer', 'product','quantity','approval_time', 'address']
    
class ProductPurchaseRecordCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductPurchaseRecord
        fields = ['customer','approval_time', 'address']