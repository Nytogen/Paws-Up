from datetime import timedelta
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import PriceSerializer, RatingSerializer, ServiceSerializer, ServiceCreationSerializer, PayOutSerializer, UploadSerializer, addServiceSerializer, ServicePurchaseRecordSerializer, PriceQuantitySerializer, addServiceQuantitySerializer
from .models import Price, PriceQuantity, Service, ServicePurchaseRecord, addService, PayoutID, addServiceQuantity
from upload.models import ServiceVerificationFiles
from rest_framework import permissions

# Create your views here.
class ServiceListAPI(APIView):
    #Adding a new pet card
        
    def post(self, request, format=None):

        if(request.user is None):
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ServiceCreationSerializer(data=request.data)

        if serializer.is_valid():
            service = serializer.save(owner = request.user)

            try:
                
                if "pricingList" not in request.data:
                    service.delete()
                    error = {"pricingList": ['send array plz']}
                    return Response(data=error, status=status.HTTP_400_BAD_REQUEST)

                if "facilityList" not in request.data:
                    service.delete()
                    error = {"facilityList": ['send array plz']}
                    return Response(data=error, status=status.HTTP_400_BAD_REQUEST)

                if "additionalServiceList" not in request.data:
                    service.delete()
                    error = {"additionalServiceList": ['send array plz']}
                    return Response(data=error, status=status.HTTP_400_BAD_REQUEST)

                for pricing in request.data.get("pricingList"):

                    priceSerializer = PriceSerializer(data=pricing)
                    
                    if not priceSerializer.is_valid():
                        service.delete()
                        return Response(data=priceSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    priceSerializer.save(service=service)

                for addService in request.data.get("additionalServiceList"):

                    ASSerializer = addServiceSerializer(data=addService)
                    
                    if not ASSerializer.is_valid():
                        service.delete()
                        return Response(data=ASSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    ASSerializer.save(service=service)

                facilityList = ""

                for facilityDetail in request.data.get("facilityList"):
                    facilityList += facilityDetail + "`"

                if(len(facilityList) > 0):
                    facilityList = facilityList[0:len(facilityList) - 1]

                else:
                    facilityList = None

                service.facilityList = facilityList
                service.save()
            
            except:
                service.delete()
                
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    #See all services that are verified
    def get(self, request):
        services = Service.objects.filter(verified_status__contains="Verified")
        serializer = ServiceSerializer(services, many = True)

        

        for serviceData in serializer.data:
            price = PriceSerializer(Price.objects.filter(service=Service.objects.get(id=serviceData.get("id"))), many=True)
            serviceData["pricingList"] = price.data

            additionalService = addServiceSerializer(addService.objects.filter(service=Service.objects.get(id=serviceData.get("id"))), many=True)
            serviceData["additionalServiceList"] = additionalService.data

            facList = Service.objects.get(id=serviceData.get("id")).facilityList

            if facList == None:
                serviceData["facilityList"] = []
            else:
                serviceData["facilityList"] = Service.objects.get(id=serviceData.get("id")).facilityList.split("`")

            owner = Service.objects.get(id=serviceData.get("id")).owner

            serviceData["owner_name"] = owner.first_name + " " + owner.last_name

        

        return Response(serializer.data, status=status.HTTP_200_OK)

class ServiceDetailAPI(APIView):
    def delete(self, request, pk):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        # check if the user trying to delete the service owns it
        if (service.owner != request.user):
            return Response("This service does not belong to you", status = status.HTTP_403_FORBIDDEN)
        service.delete()
        return Response("Service deleted.", status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 
        if(service.owner != request.user):
            return Response("This service does not belong to you.", status = status.HTTP_403_FORBIDDEN)

        serializer = ServiceSerializer(service, request.data, partial=True)
        data = {}

        if serializer.is_valid():
            serializer.save()

            if "pricingList" in request.data:

                prices = Price.objects.filter(service=service)
                pet_types = []
            
                for pricing in request.data.get("pricingList"):

                    priceSerializer = PriceSerializer(data=pricing)
                    
                    if not priceSerializer.is_valid():
                        return Response(data=priceSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    pet_types.append(priceSerializer.validated_data["pet_type"])

                    try:
                        pricingrow = prices.get(pet_type=priceSerializer.validated_data["pet_type"])
                        pricingrow.price = priceSerializer.validated_data.get("price")
                        pricingrow.save()

                    except:
                        priceSerializer.save(service=service)

                for pricing in prices:

                    if(pricing.pet_type not in pet_types):
                        pricing.delete()

            if "additionalServiceList" in request.data:

                additionalServices = addService.objects.filter(service=service)
                ASnames = []
            
                for additionalService in request.data.get("additionalServiceList"):

                    ASSerializer = addServiceSerializer(data=additionalService)
                    
                    if not ASSerializer.is_valid():
                        return Response(data=ASSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    ASnames.append(ASSerializer.validated_data["name"])

                    try:
                        ASrow = additionalServices.get(name=ASSerializer.validated_data["name"])
                        ASrow.price = ASSerializer.validated_data.get("price")
                        ASrow.save()

                    except:
                        ASSerializer.save(service=service)

                for pricing in additionalServices:

                    if(pricing.name not in ASnames):
                        pricing.delete()

            if "facilityList" in request.data:
                facilityList = ""

                for facilityDetail in request.data.get("facilityList"):
                    facilityList += facilityDetail.strip() + "`"

                if(len(facilityList) > 0):
                    facilityList = facilityList[0:len(facilityList) - 1]
                    service.facilityList = facilityList
                else:
                    service.facilityList = ""
            service.save()
            data['response'] = "Successfully updated service info"
            return Response(data, status=status.HTTP_206_PARTIAL_CONTENT)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
      
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
          
        serializer = ServiceSerializer(service)

        data = serializer.data.copy()

        price = PriceSerializer(Price.objects.filter(service=Service.objects.get(id=pk)), many=True)
        data["pricingList"] = price.data

        price = addServiceSerializer(addService.objects.filter(service=Service.objects.get(id=pk)), many=True)
        data["additionalServiceList"] = price.data

        facList = Service.objects.get(id=pk).facilityList
        if facList == None:
            data["facilityList"] = []
        else:
            data["facilityList"] = Service.objects.get(id=pk).facilityList.split("`")

        owner = Service.objects.get(id=pk).owner
        data["owner_name"] = owner.first_name + " " + owner.last_name

        return Response(data, status=status.HTTP_200_OK)

class ServiceSearchAPI(APIView):

    # search and then return services that have addresses according to the given 'address' field
    def post(self, request):

        if ("address" not in request.data):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        
        services = Service.objects.filter(address__icontains=request.data.get("address"))
        services = services.filter(verified_status__contains="Verified")
        serializer = ServiceSerializer(services, many=True)
        
        for serviceData in serializer.data:
            price = PriceSerializer(Price.objects.filter(service=Service.objects.get(id=serviceData.get("id"))), many=True)
            serviceData['pricingList'] = price.data
            
            facilityList = Service.objects.get(id=serviceData.get("id")).facilityList

            if(facilityList is None):
                serviceData['facilityList'] = []
            else:
                serviceData['facilityList'] = facilityList.split("`")

            owner = Service.objects.get(id=serviceData.get("id")).owner

            serviceData["owner_name"] = owner.first_name + " " + owner.last_name

        return Response(data = serializer.data,status=status.HTTP_200_OK)

class ServiceFilterAPI(APIView):

    def post(self, request):
        if ("address" not in request.data):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if ("filter" not in request.data):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Find queryset of prices that contain the filtered pet type
        
        petType = request.data.get("filter")

        searchedServices = Service.objects.filter(address__icontains=request.data.get("address")).filter(verified_status__contains="Verified")

        for service in searchedServices:

            pricesForFilter = Price.objects.filter(service=service).filter(pet_type__icontains=petType)

            if len(pricesForFilter) == 0:
                searchedServices = searchedServices.exclude(id=service.id)
        
        # filtered = Price.objects.filter(pet_type__icontains=petType)

        # # Create a queryset of services for the services that take care of the filtered pet type
        # filteredServices = Service.objects.none()
        # for serviceList in filtered:
        #     filteredServices = filteredServices.union(Service.objects.filter(id=serviceList.service.id))
        
        # searchedServices = filteredServices.filter(address__icontains=request.data.get("address"))
        # # Create queryset of services with the address and that are verified
        # searchedServices = Service.objects.filter(address__icontains=request.data.get("address"))
        # searchedServices = searchedServices.filter(verified_status__contains="Verified")

        # # Intersect the two querysets so it gets verified services with the filtered pet types and the searched address
        # newset = searchedServices.intersection(filteredServices)

        serializer = ServiceSerializer(searchedServices, many=True)
        
        for serviceData in serializer.data:
            price = PriceSerializer(Price.objects.filter(service=Service.objects.get(id=serviceData.get("id"))), many=True)
            serviceData['pricingList'] = price.data

            facilityList = Service.objects.get(id=serviceData.get("id")).facilityList

            if(facilityList is None):
                serviceData['facilityList'] = []
            else:
                serviceData['facilityList'] = facilityList.split("`")

            owner = Service.objects.get(id=serviceData.get("id")).owner

            serviceData["owner_name"] = owner.first_name + " " + owner.last_name
                

        return Response(data = serializer.data,status=status.HTTP_200_OK)

        
class RateAPI(APIView):
    
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        service = Service.objects.get(id=pk)

        if(service is None):
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(data = {"rating": service.rating}, status=status.HTTP_200_OK)

    def post(self, request, pk):

        serializer = RatingSerializer(data=request.data)

        if(not serializer.is_valid()):
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        service = Service.objects.get(id=pk)

        if(service is None):
            return Response(status=status.HTTP_404_NOT_FOUND)

        service.rating = round((service.rating * service.num_of_ratings + (float)(serializer.validated_data.get("rating")))/(service.num_of_ratings + 1), 1)
        service.num_of_ratings += 1
        service.save()

        return Response(data = {"rating": service.rating}, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response(status = status.HTTP_404_NOT_FOUND) 
        if(service.owner != request.user):
            return Response("This service does not belong to you.", status = status.HTTP_403_FORBIDDEN)

        serializer = ServiceSerializer(service, request.data, partial=True)
        data = {}
        if serializer.is_valid():
            serializer.save()
            if "pricingList" in request.data:
                for pricing in request.data.get("pricingList"):

                    priceSerializer = PriceSerializer(data=pricing)
                    
                    if not priceSerializer.is_valid():
                        return Response(data=priceSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    priceSerializer.save(service=service)

            if "facilityList" in request.data:
                facilityList = ""

                for facilityDetail in request.data.get("facilityList"):
                    facilityList += facilityDetail + "`"

                if(len(facilityList) > 0):
                    facilityList = facilityList[0:len(facilityList) - 1]

                serializer.facilityList = facilityList
            serializer.save()
            data['response'] = "Successfully updated service info"
            return Response(data, status=status.HTTP_206_PARTIAL_CONTENT)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class PayoutIDAPI(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        try:
            payoutID = PayoutID.objects.latest('id')
        except:
            payoutID = PayoutID(payoutID = 0)
            payoutID.save()

        id = payoutID.payoutID
        payoutID.payoutID += 1
        payoutID.save()
        
        return Response(data={"payoutID": id}, status = status.HTTP_200_OK)

def recordIsRecentDuplicate(serializer, service, request):

    try:
        recentPurchases = ServicePurchaseRecord.objects.filter(approval_time=serializer.validated_data["approval_time"])
        recentDuplicatePurchases = recentPurchases.filter(customer=request.user).filter(service=service)

        if len(recentDuplicatePurchases) > 0:
            return True

    except Exception:
        
        return False

    return False

class ServicePurchaseRecordAPI(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):

        try:
            service = Service.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        servicePurchases = ServicePurchaseRecord.objects.filter(service=service)
        serializer = ServicePurchaseRecordSerializer(servicePurchases, many=True)

        for recordData in serializer.data:

            record = ServicePurchaseRecord.objects.get(id=recordData["id"])

            priceNum = PriceQuantitySerializer(PriceQuantity.objects.filter(service_purchase_record=record), many=True)
            recordData["pricingQuantities"] = priceNum.data

            additionalService = addServiceQuantitySerializer(addServiceQuantity.objects.filter(service_purchase_record=record), many=True)
            recordData["additionalServiceQuantities"] = additionalService.data

            customer = record.customer
            recordData["customer_name"] = customer.first_name + " " + customer.last_name

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):

        if(request.user is None):
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            service = Service.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ServicePurchaseRecordSerializer(data=request.data)

        if serializer.is_valid():

            if (recordIsRecentDuplicate(serializer=serializer, service=service, request=request)):
                return Response(status=status.HTTP_208_ALREADY_REPORTED)

            serviceRecord = serializer.save(service=service, customer=request.user)

            try:
                if "pricingQuantities" not in request.data:
                    serviceRecord.delete()
                    error = {"pricingQuantities": ['send array plz']}
                    return Response(data=error, status=status.HTTP_400_BAD_REQUEST)

                if "additionalServiceQuantities" not in request.data:
                    serviceRecord.delete()
                    error = {"additionalServiceQuantities": ['send array plz']}
                    return Response(data=error, status=status.HTTP_400_BAD_REQUEST)

                for pricing in request.data.get("pricingQuantities"):

                    priceNumSerializer = PriceQuantitySerializer(data=pricing)
                    
                    if not priceNumSerializer.is_valid():
                        serviceRecord.delete()
                        return Response(data=priceNumSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    priceNumSerializer.save(service_purchase_record=serviceRecord)

                for addService in request.data.get("additionalServiceQuantities"):

                    ASNumSerializer = addServiceQuantitySerializer(data=addService)
                    
                    if not ASNumSerializer.is_valid():
                        serviceRecord.delete()
                        return Response(data=ASNumSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    ASNumSerializer.save(service_purchase_record=serviceRecord)
            
            except:
                serviceRecord.delete()
                
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class BestRatedServiceAPI(APIView):

    def get(self, request):
        services = Service.objects.filter(verified_status="Verified").order_by("-rating")[:5]
        serializer = ServiceSerializer(services, many=True)

        for serviceData in serializer.data:
            price = PriceSerializer(Price.objects.filter(service=Service.objects.get(id=serviceData.get("id"))), many=True)
            serviceData["pricingList"] = price.data
            facList = Service.objects.get(id=serviceData.get("id")).facilityList
            if facList == None:
                serviceData["facilityList"] = []
            else:
                serviceData["facilityList"] = Service.objects.get(id=serviceData.get("id")).facilityList.split("`")

            owner = Service.objects.get(id=serviceData.get("id")).owner

            serviceData["owner_name"] = owner.first_name + " " + owner.last_name

        return Response(data = serializer.data,status=status.HTTP_200_OK)

class FileUploadAPI(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, pk):

        try: 
            service = Service.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if(request.user is None):
            return Response(status=status.HTTP_403_FORBIDDEN)

        if request.user != service.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = UploadSerializer(data=request.data)
        
        if serializer.is_valid():

            if service.verified_status == 'Verified' or service.verified_status == 'Denied':
                oldFiles = ServiceVerificationFiles.objects.filter(service=service)

                for verificationFile in oldFiles:
                    verificationFile.delete()

            serializer.save(service=service)
            print(service.verified_status)
            service.verified_status = 'Pending'
            service.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):

        try: 
            service = Service.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if(request.user is None):
            return Response(status=status.HTTP_403_FORBIDDEN)

        if request.user != service.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)

        documents = ServiceVerificationFiles.objects.filter(service=service)
        return Response(data={"documentCount": len(documents)}, status=status.HTTP_200_OK)

