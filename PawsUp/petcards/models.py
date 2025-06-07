from django.db import models
from django.db.models.deletion import CASCADE

from accounts.models import PawsUpUser

# Create your models here.
class PetCard(models.Model):

    GENDER_CHOICES = [('Male','Male'), ('Female','Female')]

    name = models.CharField(max_length=40)
    age = models.IntegerField(default=0)
    species = models.CharField(max_length=40)
    breed = models.CharField(max_length=40, default='')
    weight_lbs = models.DecimalField(max_digits=5,decimal_places=2,default=0)
    gender = models.CharField(max_length=10,choices=GENDER_CHOICES,default='Male')
    owner = models.ForeignKey(PawsUpUser, on_delete=CASCADE, default=1)
    spayed_or_neutered = models.BooleanField(default=False)
    #image = models.ImageField()

    def __str__(self):
        return self.name