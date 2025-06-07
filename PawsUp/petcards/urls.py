from django.urls import path
from .views import PetCardList, PetCardDetail

urlpatterns = [
    path('<str:pk>', PetCardDetail.as_view()),
    path('', PetCardList.as_view()),
]
