from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import PawsUpUser
from petcards.models import PetCard
from service.models import Service, Price, addService, PriceQuantity, addServiceQuantity, ServicePurchaseRecord
from product.models import Product, ProductPurchaseRecord
from upload.models import ServiceVerificationFiles
from cart.models import CartItem
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group
from django.db.models import Value
from django.db.models.functions import Concat
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import ReadOnlyPasswordHashField

admin.site.site_header = "PawsUp Admin"
admin.site.site_title = "PawsUp Admin Area"
admin.site.index_title = "Welcome to the PawsUp admin area"
# Register your models here.

#Proxy Model
class Service(Service):
    class Meta:
        proxy=True

class ServicePurchaseRecord(ServicePurchaseRecord):
    class Meta:
        proxy=True
        verbose_name = "Service Purchase Record"

class Product(Product):
    class Meta:
        proxy=True

class ProductPurchaseRecord(ProductPurchaseRecord):
    class Meta:
        proxy=True
        verbose_name = "Product Purchase Record"

class PetCard(PetCard):
    class Meta:
        proxy=True
        verbose_name = "Pet Card"

#Inlines
class TokenInLine(admin.TabularInline):
    extra = 0
    model = Token

    def has_delete_permission(self, request, *args, **kwargs):
        return False

class PetCardInLine(admin.TabularInline):
    extra = 0
    model = PetCard
    show_change_link = True

class PriceInLine(admin.TabularInline):
    extra = 0
    model = Price

class addServiceInLine(admin.TabularInline):
    extra = 0
    model = addService

class PriceQuantityInLine(admin.TabularInline):
    extra = 0
    model = PriceQuantity

class addServiceQuantityInLine(admin.TabularInline):
    extra = 0
    model = addServiceQuantity

class CartItemInLine(admin.TabularInline):
    extra = 0
    model = CartItem

class ServicePurchaseRecordInLine(admin.TabularInline):
    extra = 0
    model = ServicePurchaseRecord
    show_change_link = True

    def has_change_permission(self, request, *args, **kwargs):
        return False

    def has_add_permission(self, request, *args, **kwargs):
        return False

class ProductPurchaseRecordInLine(admin.TabularInline):
    extra = 0
    model = ProductPurchaseRecord
    show_change_link = True

    def has_change_permission(self, request, *args, **kwargs):
        return False

    def has_add_permission(self, request, *args, **kwargs):
        return False

class ServiceInLine(admin.TabularInline):
    extra = 0
    model = Service
    show_change_link = True

    exclude = ['details', 'facilityList', 'checkInNotes', 'num_of_ratings']

    def has_change_permission(self, request, *args, **kwargs):
        return False

    def has_add_permission(self, request, *args, **kwargs):
        return False

class ServiceVerificationFilesInLine(admin.TabularInline):
    extra = 0
    model = ServiceVerificationFiles

    def has_change_permission(self, request, *args, **kwargs):
        return False

#Admin customizations

class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password = forms.CharField(label='Password', widget=forms.PasswordInput)

    class Meta:
        model = PawsUpUser
        fields = ('email', 'first_name', 'last_name', 'is_email_verified', 'is_admin', 'is_store')

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        print(user)
        user.set_password(self.cleaned_data.get("password"))
        if commit:
            user.save()
        return user

class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = PawsUpUser
        fields = ('__all__')

class UserAdmin(admin.ModelAdmin):

    def get_form(self, request, obj=None, **kwargs):
        if not obj:
            self.form = UserCreationForm
        else:
            self.form = UserChangeForm

        return super(UserAdmin, self).get_form(request, obj, **kwargs)

    list_display = ['first_name', 'last_name', 'is_email_verified', 'is_store', 'is_admin']

    inlines = [TokenInLine, PetCardInLine, ServiceInLine, CartItemInLine]

    list_filter = ['is_email_verified', 'is_store', 'is_admin']

    search_fields = (
        "first_name",
        "last_name",
    )

    def get_search_results(self, request, queryset, search_term):
        queryset, may_have_duplicates = super().get_search_results(
            request, queryset, search_term,
        )
        queryset |= self.model.objects.annotate(full_name=Concat('first_name', Value(' '), 'last_name')).filter(full_name__icontains=search_term)
        return queryset, may_have_duplicates

class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'address', 'rating', 'verified_status']

    inlines = [PriceInLine, addServiceInLine, ServicePurchaseRecordInLine, ServiceVerificationFilesInLine]

    list_filter = ['verified_status']

    search_fields = (
        "name",
        "address"
    )

class ServicePurchaseRecordAdmin(admin.ModelAdmin):
    list_display = ['service', 'customer', 'total_price', 'start_date', 'end_date']

    inlines = [PriceQuantityInLine, addServiceQuantityInLine]

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'rating']

    inlines = [ProductPurchaseRecordInLine]

class ProductPurchaseRecordAdmin(admin.ModelAdmin):
    list_display = ['product', 'customer', 'quantity', 'address']

class PetCardAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'species', 'breed']

    search_fields = (
        "name",
        "species",
        "breed"
    )

admin.site.unregister(Group)
admin.site.register(ServicePurchaseRecord, ServicePurchaseRecordAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(PawsUpUser, UserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(PetCard, PetCardAdmin)
admin.site.register(ProductPurchaseRecord,ProductPurchaseRecordAdmin)




