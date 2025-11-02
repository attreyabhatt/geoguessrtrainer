from django.db import models

class Country(models.Model):
    """Country with driving side information"""
    
    DRIVING_SIDE_CHOICES = [
        ('LHS', 'Left'),
        ('RHS', 'Right'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    iso2 = models.CharField(max_length=2, unique=True, help_text="2-letter ISO code (lowercase)")
    drive_side = models.CharField(max_length=3, choices=DRIVING_SIDE_CHOICES)
    flag_url = models.URLField(max_length=200)
    
    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']
    
    def __str__(self):
        return self.name


