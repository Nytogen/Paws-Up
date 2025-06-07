# Create your models here.
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

from django.conf import settings
from django.db.models.deletion import CASCADE
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class PawsUpUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        #Creates and saves a User with the given username, email, public name, and password
        if not email:
            raise ValueError('Users must have an email address') #raise errors if some are not provided
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')

        user = self.model( #Creates a tuple with the given information
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
        )

        user.set_password(password) #adds the password
        user.save(using=self._db) #Adds it to the database
        return user

    def create_superuser(self, email, first_name, last_name, password):
        #Creates and saves a Superuser with the given username, email, public name, and password
        user = self.create_user(
            email,
            first_name,
            last_name,
            password
        )
        user.is_admin = True #Same as user but admin and email verified is set to true
        user.is_email_verified = True
        user.save(using=self._db)
        return user


class PawsUpUser(AbstractBaseUser):

    #All the fields of our accounts
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    first_name = models.CharField(max_length=30, default='First Name')
    last_name = models.CharField(max_length=30, default='Last Name')

    is_service_verifiied = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_store = models.BooleanField(default=False)

    #Degisnate which fields are the username and which fields are required
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = PawsUpUserManager()

    def __str__(self):
        return self.first_name + " " + self.last_name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Yes if admin
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        return self.is_admin

    class Meta:
        verbose_name = "User"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

