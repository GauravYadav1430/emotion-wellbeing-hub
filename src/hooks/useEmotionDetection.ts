
import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useToast } from "@/hooks/use-toast";

export interface EmotionData {
  emotion: string;
  confidence: number;
}

const emotionMapping: { [key: string]: string } = {
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  fearful: 'Anxious',
  disgusted: 'Frustrated',
  surprised: 'Excited',
  neutral: 'Neutral'
};

export const useEmotionDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Starting to load face detection models...');
        // Ensure we're using the correct path to the models
        const MODEL_URL = '/models';
        
        // Try to check if models exist with a fetch request
        try {
          const response = await fetch(`${MODEL_URL}/tiny_face_detector_model-weights_manifest.json`);
          if (!response.ok) {
            console.error('Model files not found. Please run the download script first.');
            toast({
              title: "Models not found",
              description: "Face detection model files are missing. Please run the download script.",
              variant: "destructive",
            });
            setModelLoadError('Models not found');
            return;
          }
        } catch (fetchError) {
          console.error('Error checking for model files:', fetchError);
        }
        
        // Load models one by one, checking if they're already loaded
        if (!faceapi.nets.tinyFaceDetector.isLoaded) {
          console.log('Loading tiny face detector model...');
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        }
        
        if (!faceapi.nets.faceLandmark68Net.isLoaded) {
          console.log('Loading face landmark model...');
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        }
        
        if (!faceapi.nets.faceRecognitionNet.isLoaded) {
          console.log('Loading face recognition model...');
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        }
        
        if (!faceapi.nets.faceExpressionNet.isLoaded) {
          console.log('Loading face expression model...');
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        }
        
        console.log('All face detection models loaded successfully');
        setIsModelLoaded(true);
        setModelLoadError(null);
      } catch (error) {
        console.error('Error loading models:', error);
        setModelLoadError('Failed to load models');
        toast({
          title: "Error",
          description: "Failed to load emotion detection models. Please refresh the page or ensure model files are downloaded.",
          variant: "destructive",
        });
      }
    };

    loadModels();
  }, [toast]);

  const detectEmotions = async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement
  ): Promise<EmotionData | null> => {
    if (!isModelLoaded) {
      console.log('Models not loaded, cannot detect emotions');
      return null;
    }

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    try {
      console.log('Detecting face expressions...');
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        console.log('Face detected, processing expressions...');
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        const expressions = detections.expressions;
        const highestExpression = Object.entries(expressions).reduce(
          (prev, current) => (prev[1] > current[1] ? prev : current),
          ['neutral', 0]
        );

        return {
          emotion: emotionMapping[highestExpression[0]] || highestExpression[0],
          confidence: highestExpression[1]
        };
      } else {
        console.log('No face detected in this frame');
      }
    } catch (error) {
      console.error('Error in emotion detection:', error);
    }

    return null;
  };

  return {
    isModelLoaded,
    modelLoadError,
    detectEmotions
  };
};
