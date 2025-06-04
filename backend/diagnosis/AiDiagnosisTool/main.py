import random
import pandas as pd
import joblib
import os
import sys
from typing import Dict, Any, Optional

# import LogisticRegression and XGBoost from sklearn and xgboost
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier

# Try to handle the pickle loading issue by adding the modules to sys.modules
import sklearn.linear_model

sys.modules["LogisticRegression"] = sklearn.linear_model.LogisticRegression
sys.modules["XGBClassifier"] = XGBClassifier


class AiDiagnosisTool:
    """
    AI Diagnosis Tool class for loading and using machine learning models
    to diagnose hepatitis C and liver disease stages.
    """

    def __init__(self, model_dir: Optional[str] = None):
        """
        Initialize the AI Diagnosis Tool with model loading.

        Args:
            model_dir: Directory containing the model files. If None, uses current directory.
        """
        self.model_dir = model_dir or os.path.dirname(__file__)
        self.lr_model = None
        self.lr_scaler = None  # Placeholder for scaler, if used
        self.lr_feature_names = []  # Placeholder for feature names, if used
        self.xgboost_model = None
        self.xgboost_scaler = None  # Placeholder for scaler, if used
        self.xgboost_feature_names = []
        self.sorted_features_importance = []  # Store feature importance
        self._load_models()

    def _load_models(self):
        """Load the trained models from joblib files."""

        try:
            # Use the model directory and join paths properly
            lr_model_path = os.path.join(self.model_dir, "lr_model.pkl")
            lr_scaler_path = os.path.join(self.model_dir, "lr_scaler.pkl")
            lr_features_path = os.path.join(self.model_dir, "lr_features.pkl")

            self.lr_model = joblib.load(lr_model_path)
            self.lr_scaler = joblib.load(lr_scaler_path)
            lr_features = joblib.load(lr_features_path)

            # Convert pandas Index to list if necessary
            self.lr_feature_names = (
                lr_features.tolist()
                if hasattr(lr_features, "tolist")
                else list(lr_features)
            )
            # print("lr feature names:", self.lr_feature_names)

            xgboost_model_path = os.path.join(self.model_dir, "xgboost_model.pkl")
            xgboost_scaler_path = os.path.join(self.model_dir, "xgboost_scaler.pkl")
            xgboost_features_path = os.path.join(self.model_dir, "xgboost_features.pkl")

            self.xgboost_model = joblib.load(xgboost_model_path)
            self.xgboost_scaler = joblib.load(xgboost_scaler_path)
            xgb_features = joblib.load(xgboost_features_path)

            # Convert to list if necessary
            self.xgboost_feature_names = (
                xgb_features.tolist()
                if hasattr(xgb_features, "tolist")
                else list(xgb_features)
            )
            # print("xgboost feature names:", self.xgboost_feature_names)

        except Exception as e:
            print(f"Error loading models: {str(e)}")

    def predict_with_models(self, input_data: Dict[str, float]) -> Dict[str, Any]:
        """
        Make predictions using both loaded models.

        Args:
            input_data: Dictionary containing feature values

        Returns:
            Dictionary containing predictions from both models
        """
        results = {}

        try:
            # Handle None input
            if input_data is None:
                input_data = {}

            # Clean input data - remove None values and convert to float
            cleaned_data = {}
            for k, v in input_data.items():
                if v is not None and v != "":
                    try:
                        cleaned_data[k.upper()] = float(v)
                    except (ValueError, TypeError):
                        # Skip invalid values
                        # add logging
                        print(f"Invalid value for {k}: {v}, skipping.")
            # convert key of patient data to upper case
            patient_data = {k.upper(): v for k, v in cleaned_data.items()}
            # patch AGE to Age
            if "AGE" in patient_data:
                patient_data["Age"] = patient_data.pop("AGE")

            patient_data_df = pd.DataFrame([patient_data])

            # Handle missing features by adding them with default values
            for feature in self.xgboost_feature_names:
                if feature not in patient_data_df.columns:
                    patient_data_df[feature] = 0.0

            for feature in self.lr_feature_names:
                if feature not in patient_data_df.columns:
                    patient_data_df[feature] = 0.0

            # XGBoost model predictions
            selected_xgboost_features = patient_data_df[self.xgboost_feature_names]
            temp = self.xgboost_scaler.transform(selected_xgboost_features)
            scaled_xgboost_data = pd.DataFrame(temp, columns=self.xgboost_feature_names)

            hcv_status = self.xgboost_model.predict(scaled_xgboost_data)[0]
            hcv_probability = self.xgboost_model.predict_proba(scaled_xgboost_data)[0]

            # Logistic Regression model predictions
            selected_logistic_data = patient_data_df[self.lr_feature_names]
            temp = self.lr_scaler.transform(selected_logistic_data)
            scaled_lr_data = pd.DataFrame(temp, columns=self.lr_feature_names)
            hcv_stage = self.lr_model.predict(scaled_lr_data)[0]
            hcv_stage_probability = self.lr_model.predict_proba(scaled_lr_data)[0]

            # Get feature importance from LR model
            if hasattr(self.lr_model, "coef_") and self.lr_model.coef_ is not None:
                lr_feature_importance = self.lr_model.coef_[0]
                feature_importance_dict = dict(
                    zip(self.lr_feature_names, lr_feature_importance)
                )

                # Sort features by absolute importance
                self.sorted_features_importance = sorted(
                    feature_importance_dict.items(),
                    key=lambda x: abs(x[1]),
                    reverse=True,
                )
            else:
                # Fallback if model doesn't have coefficients
                self.sorted_features_importance = [
                    (f, 0.1) for f in self.lr_feature_names
                ]

            # Structure results to match get_ensemble_prediction expectations
            results = {
                "xgboost": {
                    "prediction": hcv_status,
                    "probability": hcv_probability.tolist(),
                },
                "logistic_regression": {
                    "prediction": hcv_stage,
                    "probability": hcv_stage_probability.tolist(),
                },
                "feature_importance": dict(self.sorted_features_importance),
            }

        except Exception as e:
            print(f"Error in prediction process: {e}")

        return results

    def get_stage_from_prediction(self, prediction_class: int) -> str:
        """Convert prediction class to stage name."""
        stage_mapping = {
            0: "Blood Donors",
            1: "Hepatitis",
            2: "Fibrosis",
            3: "Cirrhosis",
        }
        return stage_mapping.get(prediction_class, "Unknown")

    def get_ensemble_prediction(self, model_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combine predictions from both models to get ensemble results.

        Args:
            model_results: Results from both models

        Returns:
            Ensemble prediction results
        """
        ensemble_result = {
            "hcv_status": "Unknown",
            "hcv_status_probability": 0.5,
            "hcv_risk": "Unknown",
            "hcv_stage": "Unknown",
            "confidence": 0.5,
            "hcv_stage_probability": {
                "Blood Donors": 0.25,
                "Hepatitis": 0.25,
                "Fibrosis": 0.25,
                "Cirrhosis": 0.25,
            },
        }

        try:
            # If both models loaded successfully
            if model_results.get("logistic_regression") and model_results.get(
                "xgboost"
            ):
                logreg_data = model_results["logistic_regression"]
                xgboost_data = model_results["xgboost"]

                # Average the probabilities
                logreg_prob = logreg_data["probability"]
                xgboost_prob = xgboost_data["probability"]
                max_probability = max(logreg_prob)

                # Determine HCV status (assuming class 0 is negative, others positive)
                hcv_positive = xgboost_data["prediction"]
                ensemble_result["hcv_status"] = (
                    "Positive" if hcv_positive else "Negative"
                )
                ensemble_result["hcv_status_probability"] = max(xgboost_prob)
                ensemble_result["hcv_risk"] = (
                    "High"
                    if max_probability > 0.7 and hcv_positive
                    else "Medium" if hcv_positive else "Low"
                )
                ensemble_result["hcv_stage"] = self.get_stage_from_prediction(
                    logreg_data["prediction"]
                )
                ensemble_result["confidence"] = (
                    min(max(xgboost_data["probability"]) + max(logreg_prob) * 1.3, 2)
                    / 2
                )

                # Update stage predictions
                stage_names = ["Blood Donors", "Hepatitis", "Fibrosis", "Cirrhosis"]
                for i, stage in enumerate(stage_names):
                    if i < len(logreg_data["probability"]):
                        ensemble_result["hcv_stage_probability"][stage] = logreg_data[
                            "probability"
                        ][i]

        except Exception as e:
            print(f"Error in ensemble prediction: {e}")

        return ensemble_result

    def diagnose(self, input_data: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        """
        Main diagnosis function that uses both models to generate comprehensive results.

        Args:
            input_data: Dictionary containing patient data features

        Returns:
            Dictionary containing comprehensive diagnosis results
        """

        # Get predictions from both models
        model_results = self.predict_with_models(input_data)

        # Get ensemble prediction
        ensemble_result = self.get_ensemble_prediction(model_results)

        # Generate recommendation based on results
        recommendation = self._generate_recommendation(ensemble_result)

        # Use feature importance from model results instead of generating random ones
        feature_importance = model_results.get("feature_importance", {})

        # Combine all results
        final_results = {
            **ensemble_result,
            "recommendation": recommendation,
            "feature_importance": feature_importance,
        }

        return final_results

    def _generate_recommendation(self, results: Dict[str, Any]) -> str:
        """Generate medical recommendation based on diagnosis results."""
        hcv_status = results.get("hcv_status", "Unknown")
        hcv_stage = results.get("hcv_stage", "Unknown")
        confidence = results.get("confidence", 0.5)

        if hcv_status == "Positive" and confidence > 0.7:
            if hcv_stage in ["Fibrosis", "Cirrhosis"]:
                return (
                    f"High probability of Hepatitis C Virus (HCV) infection detected. "
                    f"The AI analysis suggests {hcv_stage} as the most likely liver disease stage. "
                    f"Immediate consultation with a hepatologist is strongly recommended for comprehensive evaluation and treatment planning, "
                    f"leveraging the insights from key indicators like CHE, ALP, and Age."
                )
            else:
                return (
                    f"Hepatitis C Virus (HCV) infection detected at {hcv_stage} stage. "
                    f"Consultation with a healthcare provider is recommended for further evaluation and appropriate treatment planning."
                )
        elif hcv_status == "Positive":
            return (
                f"Possible Hepatitis C Virus (HCV) infection detected with moderate confidence. "
                f"Additional testing and consultation with a healthcare provider is recommended for confirmation."
            )
        else:
            return (
                f"Low probability of Hepatitis C Virus (HCV) infection based on current analysis. "
                f"Regular health monitoring is recommended as part of routine healthcare."
            )


# Example usage
if __name__ == "__main__":
    # Create an instance of the diagnosis tool
    diagnosis_tool = AiDiagnosisTool()

    patient_data_list = [
        {
            "age": 32,
            "sex": "1",
            "alb": 38.5,
            "alp": 52.5,
            "ast": 22.1,
            "bil": 7.5,
            "che": 6.93,
            "chol": 3.23,
            "crea": 106.0,
            "cgt": 12.1,
            "prot": 69.0,
            "alt": 7.7,
            "category": 0,
        },
        {
            "age": 50,
            "sex": "0",
            "alb": 40.0,
            "alp": 32.7,
            "ast": 46.0,
            "bil": 10.0,
            "che": 7.51,
            "chol": 4.67,
            "crea": 56.6,
            "cgt": 22.3,
            "prot": 70.1,
            "alt": 9.0,
            "category": 1,
        },
        {
            "age": 61,
            "sex": "0",
            "alb": 50.0,
            "alp": 34.4,
            "ast": 114.4,
            "bil": 22.0,
            "che": 9.48,
            "chol": 4.62,
            "crea": 61.9,
            "cgt": 169.8,
            "prot": 86.0,
            "alt": 27.4,
            "category": 1,
        },
        {
            "age": 29,
            "sex": "1",
            "alb": 41.0,
            "alp": 43.1,
            "ast": 83.5,
            "bil": 6.0,
            "che": 11.49,
            "chol": 5.42,
            "crea": 55.2,
            "cgt": 130.0,
            "prot": 66.5,
            "alt": 2.4,
            "category": 2,
        },
    ]

    for patient_data in patient_data_list:
        # Get diagnosis
        results = diagnosis_tool.diagnose(patient_data)
        print("Diagnosis Results:")
        print(results)

    # # Print results
    # print("Diagnosis Results:")
    # print(f"HCV Status: {results['hcv_status']}")
    # print(f"HCV Stage: {results['hcv_stage']}")
    # print(f"Confidence: {results['confidence']:.2f}")
    # print(f"Recommendation: {results['recommendation']}")

    # # load models
    # print("Logistic Regression Model:", diagnosis_tool.logistic_model)
    # print("XGBoost Model:", diagnosis_tool.xgboost_model)
