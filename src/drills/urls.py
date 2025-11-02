from django.urls import path
from .views import driving_direction

urlpatterns = [
    path('driving-direction/', driving_direction, name='driving_direction'),
]
