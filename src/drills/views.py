from django.shortcuts import render
from .models import Country
from django.http import JsonResponse
import random

# Create your views here.
def driving_direction(request):
    lhs_countries = list(Country.objects.filter(drive_side='LHS'))
    rhs_countries = list(Country.objects.filter(drive_side='RHS'))
    
    if lhs_countries and rhs_countries:
        # Randomly choose LHS or RHS with equal probability
        if random.choice([True, False]):
            country = random.choice(lhs_countries)
        else:
            country = random.choice(rhs_countries)
    elif lhs_countries:
        # Only LHS countries exist
        country = random.choice(lhs_countries)
    else:
        # Only RHS countries exist
        country = random.choice(rhs_countries)
        
    context = {
        'country': country,
    }
    
    return render(request, 'drills/driving_direction.html', context)