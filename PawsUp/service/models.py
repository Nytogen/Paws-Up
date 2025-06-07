from django.db import models
from django.db.models.deletion import CASCADE

from accounts.models import PawsUpUser

# Create your models here.

class Service(models.Model):
    VERIFY_CHOICES = [('Pending','Pending'), ('Verified','Verified'), ('Denied', 'Denied'), ('NoVeriFiles', 'NoVeriFiles')]

    owner = models.ForeignKey(PawsUpUser, on_delete=models.CASCADE, default=None)
    service_type = models.CharField(max_length = 100)
    service_start = models.TimeField()
    service_end = models.TimeField()
    address = models.CharField(max_length= 50) 
    name = models.CharField(max_length=40)
    details = models.CharField(max_length = 250, blank=True)
    facilityList = models.CharField(max_length = 100, blank = True, null = True)
    checkInNotes = models.CharField(max_length = 50, blank=True)
    rating = models.FloatField(default = 0)
    num_of_ratings = models.IntegerField(default=0)
    paypal_id = models.CharField(max_length=100)
    verified_status = models.CharField(max_length=20,choices =VERIFY_CHOICES,default="NoVeriFiles")

    def __str__(self):
        return self.name

class Price(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None)
    price = models.FloatField()
    pet_type = models.CharField(max_length=20)

    def __str__(self):

        return self.service.name + ": " + self.pet_type
        
class PayoutID(models.Model):
    payoutID = models.IntegerField(default=0)

    def __str__(self):
        return str(self.payoutID)

class addService(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None)
    price = models.FloatField()
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.service.name + ": " + self.name

class ServicePurchaseRecord(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None)
    customer = models.ForeignKey(PawsUpUser, on_delete=models.CASCADE, default=None)

    total_price = models.FloatField()

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    approval_time = models.DateTimeField(default='1000-01-01 00:00:00')

    def __str__(self):
        return self.service.name + ": " + str(self.customer)

class PriceQuantity(models.Model):
    service_purchase_record = models.ForeignKey(ServicePurchaseRecord, on_delete=models.CASCADE, default=None)
    pet_type = models.CharField(max_length=20)
    quantity = models.IntegerField()

    def __str__(self):
        return str(self.service_purchase_record) + ": " + self.pet_type

class addServiceQuantity(models.Model):
    service_purchase_record = models.ForeignKey(ServicePurchaseRecord, on_delete=models.CASCADE, default=None)
    name = models.CharField(max_length=20)
    quantity = models.IntegerField()

    def __str__(self):
        return str(self.service_purchase_record) + ": " + self.name
