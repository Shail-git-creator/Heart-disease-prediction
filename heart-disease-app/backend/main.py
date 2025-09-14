from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from pathlib import Path
from typing import Dict, Any
import sys
import os

# Add the parent directory to path to import from heart-disease-project
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'heart-disease-project'))

app = FastAPI(title="Heart Disease Prediction API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://192.168.0.121:3000",
        "http://192.168.0.121:3001"
    ],  # Next.js ports and network IPs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load Model ===
BASE_DIR = Path(__file__).resolve().parent.parent.parent / "heart-disease-project"
MODEL_PATH = BASE_DIR / "models" / "heart_disease_model_final.pkl"

try:
    pipeline = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    pipeline = None

# === Pydantic Models ===
class HeartDiseaseInput(BaseModel):
    age: int
    sex: str  # "Male" or "Female"
    cp: str   # "typical", "atypical", "non-anginal", "asymptomatic"
    trestbps: int
    chol: int
    fbs: str  # "True" or "False"
    restecg: str  # "normal", "stt", "hypertrophy"
    thalch: int
    exang: str  # "Yes" or "No"
    oldpeak: float
    slope: str  # "upsloping", "flat", "downsloping"
    ca: int
    thal: str  # "normal", "fixed", "reversable"

class PredictionResponse(BaseModel):
    prediction: int  # 0 or 1
    probability: float
    risk_level: str
    message: str

# === API Endpoints ===
@app.get("/")
async def root():
    return {"message": "Heart Disease Prediction API", "status": "active"}

@app.get("/health")
async def health_check():
    model_status = "loaded" if pipeline is not None else "not loaded"
    return {"status": "healthy", "model": model_status}

@app.post("/predict", response_model=PredictionResponse)
async def predict_heart_disease(input_data: HeartDiseaseInput):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        print(f"Received input data: {input_data}")
        
        # Convert input to DataFrame
        input_dict = input_data.dict()
        print(f"Input dict: {input_dict}")
        
        X_new = pd.DataFrame([input_dict])
        print(f"DataFrame shape: {X_new.shape}")
        print(f"DataFrame columns: {X_new.columns.tolist()}")
        print(f"DataFrame values: {X_new.iloc[0].to_dict()}")
        
        # Make prediction
        prediction = pipeline.predict(X_new)[0]
        probability = pipeline.predict_proba(X_new)[0][1]
        
        print(f"Prediction: {prediction}, Probability: {probability}")
        
        # Determine risk level
        if probability < 0.3:
            risk_level = "Low"
        elif probability < 0.7:
            risk_level = "Moderate"
        else:
            risk_level = "High"
        
        # Create response message
        result = "Positive" if prediction == 1 else "Negative"
        message = f"Heart disease prediction: {result} with {probability:.1%} probability"
        
        response_data = PredictionResponse(
            prediction=int(prediction),
            probability=round(probability, 4),
            risk_level=risk_level,
            message=message
        )
        
        print(f"Response data: {response_data}")
        return response_data
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": str(type(pipeline.named_steps['classifier']).__name__),
        "features": [
            "age", "sex", "cp", "trestbps", "chol", "fbs", 
            "restecg", "thalch", "exang", "oldpeak", "slope", "ca", "thal"
        ],
        "model_path": str(MODEL_PATH)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)