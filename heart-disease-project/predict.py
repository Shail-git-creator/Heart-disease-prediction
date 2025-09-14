import pandas as pd
import joblib
from pathlib import Path

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "heart_disease_model_final.pkl"

# === Load Trained Model ===
pipeline = joblib.load(MODEL_PATH)
print("✅ Model loaded successfully")

# === Example input (must include ALL training features) ===
example_input = {
    "age": 55,
    "sex": "Male",        # categorical
    "cp": "typical",      # categorical
    "trestbps": 140,
    "chol": 350,
    "fbs": "False",       # categorical
    "restecg": "normal",  # categorical
    "thalch": 260,       # ✅ added back (max heart rate)
    "exang": "No",        # categorical
    "oldpeak": 1.2,
    "slope": "upsloping", # categorical
    "ca": 0,
    "thal": "normal"      # categorical
}

# Convert to DataFrame
X_new = pd.DataFrame([example_input])

# === Make Prediction ===
prediction = pipeline.predict(X_new)[0]
probability = pipeline.predict_proba(X_new)[0][1]

print("\n🔮 Prediction Result:")
print(f"Heart Disease: {'YES' if prediction == 1 else 'NO'}")
print(f"Probability: {probability:.2%}")
