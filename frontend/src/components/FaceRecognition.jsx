import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFace, setDetectedFace] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  // Start/stop face detection
  const toggleFaceDetection = async () => {
    if (!isDetecting) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        detectFaces();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    } else {
      stopFaceDetection();
    }
  };

  const detectFaces = async () => {
    if (!modelsLoaded || !isDetecting) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length > 0) {
      setDetectedFace(true);
    } else {
      setDetectedFace(false);
    }

    // Redraw canvas with detections
    const canvas = canvasRef.current;
    const displaySize = { width: 240, height: 180 };
    faceapi.matchDimensions(canvas, displaySize);
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (isDetecting) {
      requestAnimationFrame(detectFaces);
    }
  };

  const stopFaceDetection = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    videoRef.current.srcObject = null;
    setIsDetecting(false);
    setDetectedFace(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => {
      stopFaceDetection();
    };
  }, []);

  return (
    <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
      <h3 className="text-sm font-medium text-gray-200 mb-3">Face Recognition</h3>
      
      <div className="relative w-full h-48 bg-gray-800/50 rounded-md overflow-hidden mb-3">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${isDetecting ? '' : 'hidden'}`}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          width="240"
          height="180"
        />
        {!isDetecting && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Camera feed will appear here
          </div>
        )}
      </div>

      <button
        onClick={toggleFaceDetection}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          isDetecting
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isDetecting ? 'Stop Detection' : 'Start Face Recognition'}
      </button>

      {detectedFace !== null && (
        <p className="mt-2 text-sm text-center">
          {detectedFace ? (
            <span className="text-green-400">Face detected!</span>
          ) : (
            <span className="text-yellow-400">No face detected</span>
          )}
        </p>
      )}
    </div>
  );
};

export default FaceRecognition;
