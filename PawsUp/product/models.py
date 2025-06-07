from django.db import models
from accounts.models import PawsUpUser

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=40)
    description = models.CharField(max_length = 250, blank=True)
    price = models.FloatField(default = 0)

    rating = models.FloatField(default = 0)
    num_of_ratings = models.IntegerField(default=0)

    image = models.ImageField(default = None, upload_to='productImages/', blank=True)

    def __str__(self):
        return self.name

class ProductPurchaseRecord(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, default=None)
    customer = models.ForeignKey(PawsUpUser, on_delete=models.CASCADE, default=None)
    quantity = models.IntegerField()
    approval_time = models.DateTimeField(default='1000-01-01 00:00:00')
    address = models.CharField(max_length=80, default="None")

    def __str__(self):
        return self.product.name + ": " + str(self.customer)