from django.db import models
from service.models import Service

# Create your models here.
class ServiceVerificationFiles(models.Model):

    service = models.ForeignKey(Service, on_delete=models.CASCADE, default=None)
    file = models.FileField(upload_to='verificationDocuments/') #Need to add upload_to = and storage = 

    def __str__(self):
        return self.service.name

    def delete(self, using=None, keep_parents=False):
        self.file.storage.delete(self.file.name)
        super().delete()