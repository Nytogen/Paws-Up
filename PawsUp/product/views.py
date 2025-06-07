from django.shortcuts import render
from .models import Product, ProductPurchaseRecord
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework import permissions

from .models import Product
from cart.models import CartItem
from cart.serializers import CartItemSerializer, UserCartSerializer
from .serializers import ProductCreationSerializer, ProductPurchaseRecordSerializer, ProductSerializer,ProductPurchaseRecordCreationSerializer


# Create your views here.
class ProductDetailAPI(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def patch(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 

        if(not request.user.is_store):
            return Response("You are not a store owner", status = status.HTTP_403_FORBIDDEN)

        serializer = ProductSerializer(product, request.data, partial=True)
        data = {}

        if serializer.is_valid():
            serializer.save()
            data['response'] = "Successfully updated product info"
            return Response(data, status=status.HTTP_206_PARTIAL_CONTENT)
            
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 

        serializer = ProductSerializer(instance = product)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
    def delete(self, request, pk) :
        try:
            product = Product.objects.get(id=pk)
        except: 
            return Response(status = status.HTTP_404_NOT_FOUND) 
        if not (request.user.is_store or request.user.is_admin) :
            return Response(status = status.HTTP_403_FORBIDDEN)
        product.delete()
        return Response("Product deleted.", status = status.HTTP_204_NO_CONTENT)

class ProductsListAPI(APIView):
    def post(self, request):
        if (not request.user.is_store):
            return Response("You are not a store owner", status = status.HTTP_403_FORBIDDEN)
        
        serializer = ProductCreationSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(status = status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddCartAPI(APIView):

    def post(self, request, pk):
        if(request.user is None):
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            prod = Product.objects.get(id = pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 

        serializer = CartItemSerializer(data = request.data)
        try:
            cart = CartItem.objects.filter(customer = request.user).get(product = prod)
            return Response("Item is already in cart", status=status.HTTP_208_ALREADY_REPORTED)
        except:
            data = {}
            if serializer.is_valid():
                serializer.save(product = prod, customer = request.user)
                data['response'] = "Successfully added product to cart"
                return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
class ProductSearchAPI(APIView):
    def post(self,request):

        if ("product" not in request.data):
            return Response("\"Product\" field required.", status = status.HTTP_400_BAD_REQUEST)
        
        products = Product.objects.filter(name__icontains=request.data.get("product"))
        serializer = ProductSerializer(products, many=True)

        return Response(data = serializer.data, status = status.HTTP_200_OK)

def recordIsRecentDuplicate(serializer, product, request):

    try:
        recentPurchases = ProductPurchaseRecord.objects.filter(approval_time=serializer.validated_data["approval_time"])
        recentDuplicatePurchases = recentPurchases.filter(customer=request.user).filter(product=product)

        if len(recentDuplicatePurchases) > 0:
            return True

    except Exception:
        
        return False

    return False

class PostProductPurchaseRecordAPI(APIView):

    def post(self,request,pk):

        if((str) (request.user.id) != pk):
            return Response(status = status.HTTP_403_FORBIDDEN)
        
        cart = CartItem.objects.filter(customer_id=pk)
        serializer = UserCartSerializer(cart, many=True)

        for cartItem in serializer.data:

            purchaseSerializer = ProductPurchaseRecordCreationSerializer(data = request.data)
                
            if (recordIsRecentDuplicate(serializer=purchaseSerializer, product=cartItem['product'], request=request)):
                continue

            if not purchaseSerializer.is_valid():
                return Response(purchaseSerializer.errors, status = status.HTTP_400_BAD_REQUEST)
            
            purchaseSerializer.save(product = cartItem['product'], customer = request.user, quantity = cartItem['quantity'])
            CartItem.objects.get(id = cartItem['id']).delete()

        return Response(status = status.HTTP_201_CREATED)
        
class GetPurchaseRecordAPI(APIView):
    def get(self,request,pk):
        productRecord = ProductPurchaseRecord.objects.filter(product_id=pk)
        serializer = ProductPurchaseRecordSerializer(productRecord, many=True)

        return Response(data = serializer.data, status = status.HTTP_200_OK)


        
