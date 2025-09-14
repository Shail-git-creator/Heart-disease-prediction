'use client';

// import { Activity, User, Stethoscope } from 'lucide-react';
import { HeartDiseaseInput } from './types';

interface PredictionFormProps {
  formData: HeartDiseaseInput;
  setFormData: (data: HeartDiseaseInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const PredictionForm = ({ formData, setFormData, onSubmit, loading }: PredictionFormProps) => {
  const handleChange = (field: keyof HeartDiseaseInput, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNumberChange = (field: keyof HeartDiseaseInput, value: string, isFloat = false) => {
    // Handle empty string case
    if (!value || value.trim() === '') {
      setFormData({ ...formData, [field]: 0 });
      return;
    }
    
    const parsedValue = isFloat ? parseFloat(value) : parseInt(value, 10);
    const finalValue = isNaN(parsedValue) || !isFinite(parsedValue) ? 0 : parsedValue;
    console.log(`Setting ${field} to:`, finalValue, 'from input:', value); // Debug log
    setFormData({ ...formData, [field]: finalValue });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-blue-600">👤</span>
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              min="20"
              max="100"
              value={isNaN(formData.age) ? '' : formData.age}
              onChange={(e) => handleNumberChange('age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
            <select
              value={formData.sex}
              onChange={(e) => handleChange('sex', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vital Signs */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-red-600">📊</span>
          <h3 className="text-lg font-semibold text-gray-800">Vital Signs</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resting Blood Pressure (mmHg)
            </label>
            <input
              type="number"
              min="80"
              max="250"
              value={isNaN(formData.trestbps) ? '' : formData.trestbps}
              onChange={(e) => handleNumberChange('trestbps', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cholesterol (mg/dl)
            </label>
            <input
              type="number"
              min="100"
              max="600"
              value={isNaN(formData.chol) ? '' : formData.chol}
              onChange={(e) => handleNumberChange('chol', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Heart Rate Achieved
            </label>
            <input
              type="number"
              min="60"
              max="220"
              value={isNaN(formData.thalch) ? '' : formData.thalch}
              onChange={(e) => handleNumberChange('thalch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Clinical Parameters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-green-600">🩺</span>
          <h3 className="text-lg font-semibold text-gray-800">Clinical Parameters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chest Pain Type</label>
            <select
              value={formData.cp}
              onChange={(e) => handleChange('cp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="typical">Typical Angina</option>
              <option value="atypical">Atypical Angina</option>
              <option value="non-anginal">Non-anginal Pain</option>
              <option value="asymptomatic">Asymptomatic</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fasting Blood Sugar &gt; 120 mg/dl
            </label>
            <select
              value={formData.fbs}
              onChange={(e) => handleChange('fbs', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="False">No</option>
              <option value="True">Yes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resting ECG Results</label>
            <select
              value={formData.restecg}
              onChange={(e) => handleChange('restecg', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="stt">ST-T Wave Abnormality</option>
              <option value="hypertrophy">Left Ventricular Hypertrophy</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Induced Angina
            </label>
            <select
              value={formData.exang}
              onChange={(e) => handleChange('exang', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oldpeak (ST Depression)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={isNaN(formData.oldpeak) ? '' : formData.oldpeak}
              onChange={(e) => handleNumberChange('oldpeak', e.target.value, true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slope of Peak Exercise ST Segment
            </label>
            <select
              value={formData.slope}
              onChange={(e) => handleChange('slope', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="upsloping">Upsloping</option>
              <option value="flat">Flat</option>
              <option value="downsloping">Downsloping</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Major Vessels (0-3)
            </label>
            <select
              value={isNaN(formData.ca) ? 0 : formData.ca}
              onChange={(e) => handleNumberChange('ca', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thalassemia</label>
            <select
              value={formData.thal}
              onChange={(e) => handleChange('thal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="fixed">Fixed Defect</option>
              <option value="reversable">Reversible Defect</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>📊</span>
              <span>Analyze Risk</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;