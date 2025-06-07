from django.contrib import admin

from django import forms
from service.models import Service, Price, addService
from upload.models import ServiceVerificationFiles

admin.site.site_header = "PawsUp Admin"
admin.site.site_title = "PawsUp Admin Area"
admin.site.index_title = "Welcome to the PawsUp admin area"
# Register your models here.

class PendingService(Service):
    class Meta:
        proxy=True

class PriceInLine(admin.TabularInline):
    extra = 0
    model = Price

    def has_change_permission(self, request, *args, **kwargs):
        return False

    def has_add_permission(self, request, *args, **kwargs):
        return False

    def has_delete_permission(self, request, *args, **kwargs):
        return False

class addServiceInLine(admin.TabularInline):
    extra = 0
    model = addService
    verbose_name = "Additional Service"
    verbose_name_plural = "Additional Services"

    def has_change_permission(self, request, *args, **kwargs):
        return False

    def has_add_permission(self, request, *args, **kwargs):
        return False

    def has_delete_permission(self, request, *args, **kwargs):
        return False

class ServiceVerificationFilesInLine(admin.TabularInline):
    extra = 0
    model = ServiceVerificationFiles

    def has_change_permission(self, request, *args, **kwargs):
        return False

    def has_add_permission(self, request, *args, **kwargs):
        return False

    def has_delete_permission(self, request, *args, **kwargs):
        return False

CHOICES = (('Verified', 'Verified'), ('Denied', 'Denied'))

class PendingServiceDetail(forms.ModelForm):

    verified_status = forms.ChoiceField(choices=CHOICES)

    class Meta:
        model = PendingService
        fields = ('__all__')

class PendingServiceAdmin(admin.ModelAdmin):
    form=PendingServiceDetail

    list_display = ['name', 'owner']

    fields = ['owner', 'service_type', 'address', 'service_start', 'service_end', 'details', 'checkInNotes', 'facilityList', 'verified_status']
    readonly_fields = ['owner', 'service_type', 'address', 'service_start', 'service_end', 'details', 'checkInNotes', 'facilityList']

    inlines = [PriceInLine, addServiceInLine, ServiceVerificationFilesInLine]
    
    def get_queryset(self, *args, **kwargs):
        return Service.objects.filter(verified_status="Pending")

admin.site.register(PendingService, PendingServiceAdmin)
