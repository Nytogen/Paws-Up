from rest_framework import serializers
from .models import CartItem
from rest_framework.fields import ReadOnlyField
#Lead Serializer

class CartItemSerializer(serializers.ModelSerializer):

    product = ReadOnlyField()
    customer = ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ("product", "customer", "quantity")

class UserCartSerializer(serializers.ModelSerializer):
    product = ReadOnlyField()
    class Meta:
        model = CartItem
        fields = ("id", "product", "quantity")