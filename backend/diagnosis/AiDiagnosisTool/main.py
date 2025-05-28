import random


def AiDiagnosisTool(data):
    """
    This function serves as the entry point for the AI Diagnosis Tool.
    It initializes the tool and starts the diagnosis process.
    """

    def random_float(low, high, decimals=2):
        return round(random.uniform(low, high), decimals)

    def safe_get_float(data, key, default_range=(0, 100)):
        """Safely get and convert a value to float with fallback"""
        try:
            value = data.get(key)
            if value is not None:
                return float(value)
            return random_float(default_range[0], default_range[1])
        except (ValueError, TypeError):
            return random_float(default_range[0], default_range[1])

    def safe_get_int(data, key, default_range=(18, 80)):
        """Safely get and convert a value to int with fallback"""
        try:
            value = data.get(key)
            if value is not None:
                return int(value)
            return random.randint(default_range[0], default_range[1])
        except (ValueError, TypeError):
            return random.randint(default_range[0], default_range[1])

    # Handle both field naming conventions
    patient_name = data.get("patient_name") or data.get("patientName", "Unknown")

    dummyResults = {
        "hcv_probability": random_float(0.9, 0.99),
        "stage_predictions": {
            "Class 0 (Blood Donors)": random_float(0.01, 0.1),
            "Class 1 (Hepatitis)": random_float(0.1, 0.3),
            "Class 2 (Fibrosis)": random_float(0.5, 0.8),
            "Class 3 (Cirrhosis)": random_float(0.1, 0.3),
        },
        "feature_importance": {
            "Age": random_float(0.2, 0.3),
            "ALP": random_float(0.25, 0.35),
            "AST": random_float(0.15, 0.25),
            "CHE": random_float(0.3, 0.4),
            "CREA": random_float(0.05, 0.15),
            "GGT": random_float(0.1, 0.2),
        },
        "confidence": random_float(0.9, 0.99),
        "recommendation": (
            "High probability of Hepatitis C Virus (HCV) infection detected. "
            "The AI analysis suggests Class 2 (Fibrosis) as the most likely liver disease stage. "
            "Immediate consultation with a hepatologist is strongly recommended for comprehensive evaluation and treatment planning, "
            "leveraging the insights from key indicators like CHE, ALP, and Age."
        ),
        "patient_name": patient_name,
        "age": safe_get_int(data, "age"),
        "sex": data.get("sex", "Unknown") ,
        "ALP": safe_get_float(
            data, "alp", (40, 130)
        ),  # Note: lowercase 'alp' to match serializer
        "AST": safe_get_float(data, "ast", (10, 40)),
        "CHE": safe_get_float(data, "che", (3.0, 8.0)),
        "CREA": safe_get_float(data, "crea", (0.6, 1.3)),
        "GGT": safe_get_float(data, "ggt", (10, 60)),
    }

    return dummyResults
