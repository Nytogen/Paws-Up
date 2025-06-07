from django.urls import path
from product.views import PostProductPurchaseRecordAPI

from cart.views import ViewUserCartAPI
from .views import ProfileOverview, RegisterAPI, VerifyEmailAPI, LoginAPI, UserDetail, UserList, StoreLoginAPI

urlpatterns = [
    path('register', RegisterAPI.as_view(), name="register"),
    path('email-verify', VerifyEmailAPI.as_view(), name="email-verify"),
    path('login', LoginAPI.as_view(), name="login"),
    path('', UserList.as_view(), name = 'list'),
    path('storelogin', StoreLoginAPI.as_view(), name='storelogin'),
    path('<str:pk>', UserDetail.as_view(), name = "edit"),
    path('<str:pk>/profile', ProfileOverview.as_view(), name='profile'),
    path('<str:pk>/getCart',ViewUserCartAPI.as_view(), name = 'cart'),
    path('<str:pk>/payCart',PostProductPurchaseRecordAPI.as_view(), name = 'payCart')
]
