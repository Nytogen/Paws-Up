from django.urls import path
from product.views import ProductDetailAPI, ProductsListAPI, AddCartAPI, ProductSearchAPI, GetPurchaseRecordAPI

urlpatterns = [
    path('', ProductsListAPI.as_view(), name = "productList"),
    path('search', ProductSearchAPI.as_view(), name = "productSearch"),
    path('<str:pk>', ProductDetailAPI.as_view(), name="productdetail"),
    path('<str:pk>/addCart', AddCartAPI.as_view(), name="addCart"),
    path('<str:pk>/getPurchaseRecords',GetPurchaseRecordAPI.as_view(), name = 'getPurchaseRecords')
]



