from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import joblib
from django.conf import settings
import os
import json


@api_view(["POST"])
def analyze_hcv(request):
    try:
        # Extract features from request
        data = request.data

        # Required features
        required_features = ["age", "sex", "alp", "ast", "che", "crea", "ggt"]
        features = []

        for feature in required_features:
            if feature not in data or data[feature] is None:
                return Response(
                    {"error": f"Missing required field: {feature}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            features.append(float(data[feature]))

        # Optional features (set to median values if not provided)
        optional_features = {
            "alb": 4.0,
            "bil": 1.0,
            "chol": 200.0,
            "prot": 7.0,
            "alt": 30.0,
        }

        for feature, default_value in optional_features.items():
            value = data.get(feature)
            if value is not None and value != "":
                features.append(float(value))
            else:
                features.append(default_value)

        # Create feature array
        X = np.array(features).reshape(1, -1)

        # Load your trained model (you'll need to create this)
        # For now, let's simulate predictions
        hcv_probability = simulate_hcv_prediction(X)
        stage_predictions = simulate_stage_prediction(X)
        feature_importance = simulate_feature_importance(features)

        # Generate recommendation
        recommendation = generate_recommendation(hcv_probability, stage_predictions)

        # Calculate confidence
        confidence = max(hcv_probability, 1 - hcv_probability)

        response_data = {
            "hcv_probability": float(hcv_probability),
            "stage_predictions": stage_predictions,
            "feature_importance": feature_importance,
            "confidence": float(confidence),
            "recommendation": recommendation,
            "patient_name": data.get("patient_name", "Unknown"),
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Analysis failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def simulate_hcv_prediction(X):
    """Simulate HCV prediction - replace with your actual model"""
    # Simple simulation based on some logic
    ast_value = X[0][2]  # AST value
    alt_value = X[0][-1] if len(X[0]) > 7 else 30  # ALT value or default

    # Higher AST/ALT ratio suggests liver damage
    ratio = ast_value / alt_value if alt_value > 0 else 1

    if ratio > 2:
        return min(0.85, 0.3 + (ratio * 0.2))
    elif ratio > 1.5:
        return 0.65
    else:
        return 0.25


def simulate_stage_prediction(X):
    """Simulate fibrosis stage prediction"""
    # Simple simulation
    return {"F0": 0.4, "F1": 0.3, "F2": 0.2, "F3": 0.08, "F4": 0.02}


def simulate_feature_importance(features):
    """Simulate feature importance"""
    feature_names = [
        "age",
        "sex",
        "alp",
        "ast",
        "che",
        "crea",
        "ggt",
        "alb",
        "bil",
        "chol",
        "prot",
        "alt",
    ]
    return {
        feature_names[i]: np.random.uniform(-0.5, 0.5) for i in range(len(features))
    }


def generate_recommendation(hcv_prob, stage_pred):
    """Generate clinical recommendation"""
    if hcv_prob > 0.7:
        return "High probability of HCV infection. Immediate consultation with a hepatologist is strongly recommended."
    elif hcv_prob > 0.4:
        return "Moderate risk detected. Consider follow-up testing and consultation with healthcare provider."
    else:
        return "Low probability of HCV infection. Regular monitoring recommended as part of routine care."
