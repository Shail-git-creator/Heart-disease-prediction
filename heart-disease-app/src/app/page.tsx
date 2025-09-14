import HeartDiseasePredictor from '@/components/HeartDiseasePredictor';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Heart Disease Prediction System
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered risk assessment for cardiovascular health
          </p>
        </header>
        
        <HeartDiseasePredictor />
        
        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>This tool is for educational purposes only and should not replace professional medical advice.</p>
        </footer>
      </div>
    </div>
  );
}
