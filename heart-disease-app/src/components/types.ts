export interface HeartDiseaseInput {
  age: number;
  sex: string;
  cp: string;
  trestbps: number;
  chol: number;
  fbs: string;
  restecg: string;
  thalch: number;
  exang: string;
  oldpeak: number;
  slope: string;
  ca: number;
  thal: string;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_level: string;
  message: string;
}