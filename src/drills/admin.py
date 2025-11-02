from django.contrib import admin
from django.utils.html import format_html
from .models import Country, DrillSession

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'iso2']
    search_fields = ['name', 'iso2']

@admin.register(DrillSession)
class DrillSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'started_at', 'correct_answers', 'total_questions', 'accuracy']
    readonly_fields = ['started_at', 'completed_at']