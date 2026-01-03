from django.urls import path
from .views import driving_direction, fun_with_flags, domain_drill

urlpatterns = [
    path('driving-direction/', driving_direction, name='driving_direction'),
    path('fun-with-flags/', fun_with_flags, name='fun_with_flags'),
    path('domain-drill/', domain_drill, name='domain_drill'),
]
