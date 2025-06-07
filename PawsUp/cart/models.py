from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey

from product.models import Product
from accounts.models import PawsUpUser

# Create your models here.

class CartItem(models.Model):
    product = ForeignKey(Product, on_delete=CASCADE, default=None)
    customer = ForeignKey(PawsUpUser, on_delete=CASCADE, default=None)
    quantity = models.IntegerField()

    def __str__(self):
        return str(self.id)