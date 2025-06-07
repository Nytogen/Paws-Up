from django.contrib import admin

from django import forms
from service.models import Service, Price

admin.site.site_header = "PawsUp Admin"
admin.site.site_title = "PawsUp Admin Area"
admin.site.index_title = "Welcome to the PawsUp admin area"
# Register your models here.

class ServiceTemp(Service):
    class Meta:
        proxy=True

class PriceInLine(admin.TabularInline):
    model = Price

CHOICES = (('approved', 'approved'), ('not', 'not approved'))

class Something(forms.ModelForm):

    name = forms.ChoiceField(choices=CHOICES)

    class Meta:
        model = ServiceTemp
        fields = ('__all__')

class ServiceAdmin(admin.ModelAdmin):
    form=Something

    list_display = ['name', 'owner']

    fields = ['name', 'owner']
    readonly_fields = ['owner']

    inlines = [PriceInLine]
    
    def get_queryset(self, *args, **kwargs):
        return Service.objects.filter(name="the 2nd best house")