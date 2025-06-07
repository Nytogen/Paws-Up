from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from rest_framework import permissions

from product.serializers import ProductSerializer
from product.models import Product
from .serializers import CartItemSerializer, UserCartSerializer

from .models import CartItem

# Create your views here.
class CartItemDetailAPI(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 

        if(cart_item.customer != request.user):
            return Response(status = status.HTTP_403_FORBIDDEN)

        serializer = CartItemSerializer(cart_item, request.data, partial=True)
        data = {}

        if serializer.is_valid():
            serializer.save()
            data['response'] = "Successfully updated product info"
            return Response(data, status=status.HTTP_206_PARTIAL_CONTENT)
            
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            cart_item = CartItem.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 

        if(cart_item.customer != request.user):
            return Response(status = status.HTTP_403_FORBIDDEN)
        cart_item.delete()
        
        return Response("Item deleted from cart.", status = status.HTTP_204_NO_CONTENT)

class ViewUserCartAPI(APIView):
    def get(self,request,pk):
        if((str) (request.user.id) != pk):
            return Response(status = status.HTTP_403_FORBIDDEN)
        
        cart = CartItem.objects.filter(customer_id=pk)
        serializer = UserCartSerializer(cart, many=True)
        
        for productInfo in serializer.data:
            productInfo['product'] = ProductSerializer(productInfo.get("product")).data
            


        return Response(data = serializer.data, status = status.HTTP_200_OK)
