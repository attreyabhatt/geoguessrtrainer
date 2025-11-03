from django.shortcuts import render
from django.http import HttpResponse
from .models import Country
import random

def driving_direction(request):
    lhs_countries = list(Country.objects.filter(drive_side='LHS'))
    rhs_countries = list(Country.objects.filter(drive_side='RHS'))
    
    # Check if there are any countries at all
    if not lhs_countries and not rhs_countries:
        # No countries in database - show error message
        return HttpResponse(
            '<h1>No countries found</h1>'
            '<p>Please add countries to the database through the admin panel.</p>'
            '<a href="/admin/">Go to Admin</a>',
            status=404
        )
    
    # Select a random country
    if lhs_countries and rhs_countries:
        # Both types exist - randomly choose LHS or RHS with equal probability
        if random.choice([True, False]):
            country = random.choice(lhs_countries)
        else:
            country = random.choice(rhs_countries)
    elif lhs_countries:
        # Only LHS countries exist
        country = random.choice(lhs_countries)
    else:
        # Only RHS countries exist (we know this list is not empty due to first check)
        country = random.choice(rhs_countries)
        
    context = {
        'country': country,
    }
    
    return render(request, 'drills/driving_direction.html', context)