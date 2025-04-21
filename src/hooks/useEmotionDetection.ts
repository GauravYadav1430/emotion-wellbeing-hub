
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
  const { toast } = useToast();

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        
        if (!faceapi.nets.tinyFaceDetector.isLoaded) {
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        }
        if (!faceapi.nets.faceLandmark68Net.isLoaded) {
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        }
        if (!faceapi.nets.faceRecognitionNet.isLoaded) {
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        }
        if (!faceapi.nets.faceExpressionNet.isLoaded) {
          await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        }
        
        setIsModelLoaded(true);
        console.log('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        toast({
          title: "Error",
          description: "Failed to load emotion detection models",
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
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
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
      }
    } catch (error) {
      console.error('Error in emotion detection:', error);
    }

    return null;
  };

  return {
    isModelLoaded,
    detectEmotions
  };
};
