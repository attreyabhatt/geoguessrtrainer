from django.contrib import admin
from django.utils.html import format_html
from .models import Country

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'iso2']
    search_fields = ['name', 'iso2']
    list_filter = ['drive_side']