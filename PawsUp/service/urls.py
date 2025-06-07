from django.urls import path
from .views import ServiceFilterAPI, ServiceListAPI, RateAPI, ServiceDetailAPI, ServiceSearchAPI, PayoutIDAPI, ServicePurchaseRecordAPI, BestRatedServiceAPI, FileUploadAPI

urlpatterns = [
    path('', ServiceListAPI.as_view(), name="serviceList"),
    path('payoutid', PayoutIDAPI.as_view(), name="payoutID"),
    path('search', ServiceSearchAPI.as_view(), name="serviceSearch"),
    path('toprated', BestRatedServiceAPI.as_view(), name='topRated'),
    path('filter', ServiceFilterAPI.as_view(), name="serviceFilter"),
    path('toprated', BestRatedServiceAPI.as_view(), name='topRated'),
    path('<int:pk>', ServiceDetailAPI.as_view(), name='serviceProvfile'),
    path('<pk>/rate/', RateAPI.as_view(), name="rate"),
    path('<pk>/purchase', ServicePurchaseRecordAPI.as_view(), name="purchaseRecord"),
    path('<pk>/rate/', RateAPI.as_view(), name="rate"),
    path('<pk>/upload/', FileUploadAPI.as_view(), name="upload")
]

