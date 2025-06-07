from rest_framework import routers, urlpatterns
from . import views
from .views import LeadViewSet

router = routers.DefaultRouter()
router.register('api/Home', LeadViewSet, 'leads')
urlpatterns = router.urls