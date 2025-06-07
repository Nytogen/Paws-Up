from django.urls import path

from .views import CartItemDetailAPI

urlpatterns = [
    path('<str:pk>', CartItemDetailAPI.as_view(), name="cartItemDetail"),
]