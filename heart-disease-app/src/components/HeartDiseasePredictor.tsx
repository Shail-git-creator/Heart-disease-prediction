'use client';

import { useState } from 'react';
// import axios from 'axios';
// import { Heart, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import PredictionForm from './PredictionForm';
import PredictionResults from './PredictionResults';
import { HeartDiseaseInput, PredictionResponse } from './types';

const HeartDiseasePredictor = () => {
  const [formData, setFormData] = useState<HeartDiseaseInput>(() => ({
    age: 50,
    sex: 'Male',
    cp: 'typical',
    trestbps: 120,
    chol: 200,
    fbs: 'False',
    restecg: 'normal',
    thalch: 150,
    exang: 'No',
    oldpeak: 0,
    slope: 'upsloping',
    ca: 0,
    thal: 'normal'
  }));
  
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending prediction request with data:', formData);
      
      // Determine the correct API URL based on current location
      const currentHost = window.location.hostname;
      const apiBaseUrl = currentHost === 'localhost' ? 'http://localhost:8000' : `http://${currentHost}:8000`;
      console.log('Using API URL:', apiBaseUrl);
      
      const response = await fetch(`${apiBaseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Prediction failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Prediction response:', data);
      setPrediction(data);
    } catch (err: unknown) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 text-white">❤️</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Health Assessment</h2>
              <p className="text-blue-100">Enter your health parameters for risk analysis</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
          )}
          
          {!prediction ? (
            <PredictionForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          ) : (
            <PredictionResults 
              prediction={prediction}
              onReset={handleReset}
              formData={formData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeartDiseasePredictor;