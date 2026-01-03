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
    
    # Get all LHS country names sorted by name for the reference list
    lhs_country_names = list(
        Country.objects.filter(drive_side='LHS')
        .order_by('name')
        .values_list('name', flat=True)
    )
    
    context = {
        'country': country,
        'lhs_countries': lhs_country_names,
    }
    
    return render(request, 'drills/driving_direction.html', context)

def fun_with_flags(request):
    # Get all countries for autocomplete
    all_countries = list(Country.objects.all().only('name', 'flag_url'))

    if not all_countries:
        return HttpResponse(
            '<h1>No countries found</h1>'
            '<p>Please add countries to the database through the admin panel.</p>'
            '<a href="/admin/">Go to Admin</a>',
            status=404
        )
    
    # Select a random country to display
    country = random.choice(all_countries)
    
    # Get all country names for autocomplete (sorted)
    all_country_names = sorted([c.name for c in all_countries])
    
    context = {
        'country': country,
        'all_countries': all_country_names,
    }
    return render(request, 'drills/fun_with_flags.html', context)
