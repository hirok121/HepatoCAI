#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(
    "d:\\Programming\\Code_Record\\Project\\Web_dev\\django+reat\\HepatoCAI\\backend"
)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from diagnosis.models import Diagnosis
from users.models import CustomUser

try:
    user = CustomUser.objects.get(username="hirok5")
    diagnoses = Diagnosis.objects.filter(created_by=user)

    print(f"Found {diagnoses.count()} diagnoses for user hirok5")

    if diagnoses.exists():
        # Get the first diagnosis and print its fields
        d = diagnoses.first()
        print(f"\nDiagnosis {d.id} fields:")
        for field in d._meta.get_fields():
            if hasattr(d, field.name):
                value = getattr(d, field.name)
                print(f"  {field.name}: {value}")

        # Print raw data structure
        print(f"\nRaw diagnosis data:")
        print(f"  ID: {d.id}")
        print(f"  Patient Name: {d.patient_name}")
        print(f"  Age: {d.age}")
        print(f"  Sex: {d.sex}")
        print(f"  HCV Status: {d.hcv_status}")
        print(f"  HCV Risk: {d.hcv_risk}")
        print(f"  Confidence: {d.confidence}")
        print(f"  Created by: {d.created_by}")

except CustomUser.DoesNotExist:
    print("User hirok5 not found")
except Exception as e:
    print(f"Error: {e}")
