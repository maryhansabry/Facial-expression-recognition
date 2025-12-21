import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const EmotionRecognitionApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const emotionColors = {
    'Happy': 'bg-yellow-500',
    'Sad': 'bg-blue-500',
    'Angry': 'bg-red-500',
    'Surprise': 'bg-purple-500',
    'Fear': 'bg-gray-500',
    'Disgust': 'bg-green-500',
    'Neutral': 'bg-slate-500'
  };

  const emotionEmojis = {
    'Happy': '😊',
    'Sad': '😢',
    'Angry': '😠',
    'Surprise': '😲',
    'Fear': '😨',
    'Disgust': '🤢',
    'Neutral': '😐'
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCamera(true);
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
        analyzeFace(file);
      }, 'image/jpeg');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      analyzeFace(file);
    }
  };

  const analyzeFace = async (file) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/v1/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Is the backend running?');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Emotion Recognition
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Powered by SWIN Transformer Deep Learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Capture Face
            </h2>

            {!preview && !useCamera && (
              <div className="space-y-4">
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Upload className="w-6 h-6" />
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                
                <button
                  onClick={startCamera}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Camera className="w-6 h-6" />
                  Use Camera
                </button>

                <div className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300">
                  <div className="text-6xl text-center mb-3">📸</div>
                  <p className="text-center text-gray-600 font-medium">
                    Choose an option above to get started
                  </p>
                </div>
              </div>
            )}

            {useCamera && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-xl shadow-lg"
                />
                <div className="flex gap-3">
                  <button
                    onClick={capturePhoto}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all shadow-lg font-medium"
                  >
                    📷 Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-all shadow-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {preview && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-xl shadow-lg"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    <span className="text-gray-600 font-medium">Analyzing expression...</span>
                  </div>
                )}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Results
            </h2>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
                <p className="text-red-600 font-medium">⚠️ {error}</p>
                <p className="text-red-500 text-sm mt-2">
                  Make sure the backend is running at {API_URL}
                </p>
              </div>
            )}

            {!prediction && !error && !loading && (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-12 h-12 text-purple-500" />
                </div>
                <p className="text-gray-400 text-lg">
                  Upload an image or use your camera to detect emotions
                </p>
              </div>
            )}

            {prediction && (
              <div className="space-y-6">
                
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg transform transition-all hover:scale-105">
                  <p className="text-sm font-medium opacity-90 mb-2">
                    Detected Emotion
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">
                      {emotionEmojis[prediction.prediction.emotion] || '😊'}
                    </span>
                    <div>
                      <p className="text-4xl font-bold">
                        {prediction.prediction.emotion}
                      </p>
                      <p className="text-lg opacity-90">
                        {(prediction.prediction.confidence * 100).toFixed(1)}% confident
                      </p>
                    </div>
                  </div>
                </div>

                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    All Emotions Detected
                  </h3>
                  <div className="space-y-3">
                    {prediction.all_predictions.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {emotionEmojis[item.emotion] || '😊'}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {item.emotion}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${emotionColors[item.emotion] || 'bg-gray-500'} transition-all duration-700 ease-out`}
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                
                <button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg font-medium"
                >
                  🔄 Try Another Image
                </button>
              </div>
            )}
          </div>
        </div>

        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with FastAPI + React + SWIN Transformer 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default EmotionRecognitionApp;