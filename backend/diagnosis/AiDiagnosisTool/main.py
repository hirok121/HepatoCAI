import random


def AiDiagnosisTool():
    """
    This function serves as the entry point for the AI Diagnosis Tool.
    It generates diagnosis results based on input data.
    """

    def random_float(low, high, decimals=2):
        return round(random.uniform(low, high), decimals)

    # AI diagnosis results - only return diagnosis-specific data
    dummyResults = {
        "hcv_status": "Positive",
        "hcv_status_probability": random_float(0.9, 0.99),
        "hcv_risk": "High",
        "hcv_stage": "Fibrosis",  # Fibrosis stage
        "confidence": random_float(0.9, 0.99),
        "stage_predictions": {
            "Blood Donors": random_float(0.01, 0.1),
            "Hepatitis": random_float(0.1, 0.3),
            "Fibrosis": random_float(0.5, 0.8),
            "Cirrhosis": random_float(0.1, 0.3),
        },
        "recommendation": (
            "High probability of Hepatitis C Virus (HCV) infection detected. "
            "The AI analysis suggests Class 2 (Fibrosis) as the most likely liver disease stage. "
            "Immediate consultation with a hepatologist is strongly recommended for comprehensive evaluation and treatment planning, "
            "leveraging the insights from key indicators like CHE, ALP, and Age."
        ),
        # Feature importance for frontend display
        "feature_importance": {
            "Age": random_float(0.1, 0.3),
            "ALP": random_float(0.2, 0.4),
            "AST": random_float(0.15, 0.35),
            "CHE": random_float(0.25, 0.45),
            "CREA": random_float(0.05, 0.2),
            "GGT": random_float(0.1, 0.3),
        },
    }

    return dummyResults
