'use client';

// import { 
//   AlertTriangle, 
//   CheckCircle, 
//   Heart, 
//   RotateCcw, 
//   TrendingUp,
//   Activity,
//   Shield
// } from 'lucide-react';
import { PredictionResponse, HeartDiseaseInput } from './types';

interface PredictionResultsProps {
  prediction: PredictionResponse;
  onReset: () => void;
  formData: HeartDiseaseInput;
}

const PredictionResults = ({ prediction, onReset, formData }: PredictionResultsProps) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-50 border-green-200';
      case 'Moderate': return 'bg-yellow-50 border-yellow-200';
      case 'High': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return <span className="text-green-600">✅</span>;
      case 'Moderate': return <span className="text-yellow-600">⚠️</span>;
      case 'High': return <span className="text-red-600">⚠️</span>;
      default: return <span className="text-gray-600">🛡️</span>;
    }
  };

  const getRiskRecommendations = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return [
          'Continue maintaining a healthy lifestyle',
          'Regular exercise and balanced diet',
          'Annual health checkups recommended',
          'Monitor blood pressure and cholesterol levels'
        ];
      case 'Moderate':
        return [
          'Consult with a healthcare provider',
          'Consider lifestyle modifications',
          'More frequent health monitoring',
          'Discuss preventive measures with your doctor'
        ];
      case 'High':
        return [
          'Seek immediate medical consultation',
          'Discuss comprehensive treatment options',
          'Consider cardiac evaluation',
          'Follow prescribed medications and lifestyle changes'
        ];
      default:
        return ['Consult with a healthcare professional'];
    }
  };

  const keyFactors = [
    { label: 'Age', value: isNaN(formData.age) ? 0 : formData.age, unit: 'years' },
    { label: 'Max Heart Rate', value: isNaN(formData.thalch) ? 0 : formData.thalch, unit: 'bpm' },
    { label: 'Cholesterol', value: isNaN(formData.chol) ? 0 : formData.chol, unit: 'mg/dl' },
    { label: 'Blood Pressure', value: isNaN(formData.trestbps) ? 0 : formData.trestbps, unit: 'mmHg' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className={`p-6 rounded-lg border-2 ${getRiskBgColor(prediction.risk_level)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getRiskIcon(prediction.risk_level)}
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {prediction.prediction === 1 ? 'Positive Risk Detected' : 'Low Risk Detected'}
              </h3>
              <p className={`text-lg font-semibold ${getRiskColor(prediction.risk_level)}`}>
                {prediction.risk_level} Risk Level
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">
              {isNaN(prediction.probability) ? '0.0' : (prediction.probability * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Probability</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                prediction.risk_level === 'Low' ? 'bg-green-500' :
                prediction.risk_level === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${isNaN(prediction.probability) ? 0 : prediction.probability * 100}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-700">{prediction.message}</p>
      </div>

      {/* Key Factors */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-blue-600">📊</span>
          <h4 className="text-lg font-semibold text-gray-800">Key Health Factors</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyFactors.map((factor, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border">
              <div className="text-sm text-gray-600">{factor.label}</div>
              <div className="text-lg font-semibold text-gray-800">
                {factor.value} <span className="text-sm text-gray-500">{factor.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-blue-600">❤️</span>
          <h4 className="text-lg font-semibold text-gray-800">Recommendations</h4>
        </div>
        
        <ul className="space-y-2">
          {getRiskRecommendations(prediction.risk_level).map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Information */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-600 mt-0.5">⚠️</span>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Important Notice</h4>
            <p className="text-sm text-gray-700">
              This prediction is based on machine learning analysis and should not be considered as a 
              definitive medical diagnosis. Always consult with qualified healthcare professionals for 
              proper medical evaluation and treatment decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>New Assessment</span>
        </button>
        
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>📊</span>
          <span>Print Results</span>
        </button>
      </div>
    </div>
  );
};

export default PredictionResults;