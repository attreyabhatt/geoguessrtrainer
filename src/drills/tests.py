from django.test import TestCase
from django.urls import reverse

from .models import Country


class DrillViewTests(TestCase):
    def test_driving_direction_empty_db_returns_404(self):
        response = self.client.get(reverse("driving_direction"))
        self.assertEqual(response.status_code, 404)
        self.assertContains(response, "No countries found")

    def test_fun_with_flags_empty_db_returns_404(self):
        response = self.client.get(reverse("fun_with_flags"))
        self.assertEqual(response.status_code, 404)
        self.assertContains(response, "No countries found")

    def test_driving_direction_with_country(self):
        Country.objects.create(
            name="Testland",
            iso2="tl",
            drive_side="LHS",
            flag_url="https://example.com/flag.png",
        )
        response = self.client.get(reverse("driving_direction"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Testland")

    def test_fun_with_flags_with_country(self):
        Country.objects.create(
            name="Examplestan",
            iso2="ex",
            drive_side="RHS",
            flag_url="https://example.com/flag2.png",
        )
        response = self.client.get(reverse("fun_with_flags"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Examplestan")
