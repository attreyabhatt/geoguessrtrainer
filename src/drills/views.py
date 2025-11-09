from django.shortcuts import render
from django.http import HttpResponse
from .models import Country
import random

def driving_direction(request):
    # Optimize queries by only loading necessary fields
    lhs_countries = list(Country.objects.filter(drive_side='LHS').only('name', 'flag_url', 'drive_side'))
    rhs_countries = list(Country.objects.filter(drive_side='RHS').only('name', 'flag_url', 'drive_side'))
    
    # Check if there are any countries at all
    if not lhs_countries and not rhs_countries:
        # No countries in database - show error message
        return HttpResponse(
            '<h1>No countries found</h1>'
            '<p>Please add countries to the database through the admin panel.</p>'
            '<a href="/admin/">Go to Admin</a>',
            status=404
        )
    
    # Select a random country with 2/3 probability for LHS and 1/3 for RHS
    if lhs_countries and rhs_countries:
        # Both types exist - choose LHS with 2/3 probability, RHS with 1/3 probability
        random_value = random.random()  # Returns float between 0.0 and 1.0
        if random_value < 2/3:  # 66.67% chance
            country = random.choice(lhs_countries)
        else:  # 33.33% chance
            country = random.choice(rhs_countries)
    elif lhs_countries:
        # Only LHS countries exist
        country = random.choice(lhs_countries)
    else:
        # Only RHS countries exist (we know this list is not empty due to first check)
        country = random.choice(rhs_countries)
    
    # Get all LHS countries sorted by name for the reference list
    # Only load the name field for better performance
    all_lhs_countries = Country.objects.filter(drive_side='LHS').only('name').order_by('name')
    
    context = {
        'country': country,
        'lhs_countries': all_lhs_countries,
    }
    
    return render(request, 'drills/driving_direction.html', context)

def fun_with_flags(request):
    countries = Country.objects.all().only('name', 'flag_url').order_by('name')
    context = {
        'countries': countries,
    }
    return render(request, 'drills/fun_with_flags.html', context)