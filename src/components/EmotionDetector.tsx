
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EmotionData {
  emotion: string;
  confidence: number;
}

const EmotionDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionData | null>(null);
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        
        // Check if models are already loaded
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
        console.log('Face detection models loaded');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();

    // Create models directory and download models
    const createModelsDirectory = async () => {
      // This function will download the face-api.js models if they don't exist
      // In a real app, these would be hosted on your server or CDN
      const modelFiles = [
        'face_expression_model-shard1',
        'face_expression_model-weights_manifest.json',
        'face_landmark_68_model-shard1',
        'face_landmark_68_model-weights_manifest.json',
        'face_recognition_model-shard1',
        'face_recognition_model-shard2',
        'face_recognition_model-weights_manifest.json',
        'tiny_face_detector_model-shard1',
        'tiny_face_detector_model-weights_manifest.json'
      ];
      
      const modelsDir = '/models';
      
      // Download logic would go here
      console.log('Model files would be downloaded to:', modelsDir);
    };
    
    createModelsDirectory();

    return () => {
      stopCapture();
    };
  }, []);

  const startCapture = async () => {
    if (!isModelLoaded) {
      toast({
        title: "Models not loaded",
        description: "Please wait for the emotion detection models to load",
        variant: "destructive",
      });
      return;
    }

    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCapturing(true);
        detectEmotions();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const detectInterval = setInterval(async () => {
      if (!isCapturing) {
        clearInterval(detectInterval);
        return;
      }

      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Clear the canvas
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the detection results
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

          // Get the highest emotion confidence
          const expressions = detections.expressions;
          let highestExpression = Object.entries(expressions).reduce(
            (prev, current) => (prev[1] > current[1] ? prev : current),
            ['neutral', 0]
          );

          // Map face-api expressions to our emotion categories
          const emotionMapping: { [key: string]: string } = {
            happy: 'Happy',
            sad: 'Sad',
            angry: 'Angry',
            fearful: 'Anxious',
            disgusted: 'Frustrated',
            surprised: 'Excited',
            neutral: 'Neutral'
          };

          setDetectedEmotion({
            emotion: emotionMapping[highestExpression[0]] || highestExpression[0],
            confidence: highestExpression[1] as number
          });
        }
      } catch (error) {
        console.error('Error in emotion detection:', error);
      }
    }, 100);

    return () => clearInterval(detectInterval);
  };

  const saveEmotion = async () => {
    if (!detectedEmotion || !user) return;
    
    try {
      const { error } = await supabase.from('emotions').insert({
        user_id: user.id,
        emotion: detectedEmotion.emotion,
        confidence: detectedEmotion.confidence,
        notes: notes
      });
      
      if (error) throw error;
      
      toast({
        title: "Emotion saved",
        description: `Your ${detectedEmotion.emotion} emotion has been recorded`,
      });
      
      stopCapture();
      setDetectedEmotion(null);
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error saving emotion",
        description: error.message || "Failed to save your emotion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          width={640}
          height={480}
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          width={640}
          height={480}
        />
        
        {!isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Button 
              onClick={startCapture}
              className="bg-wellness-purple hover:bg-wellness-purple-dark text-white"
            >
              Start Camera
            </Button>
          </div>
        )}
      </div>
      
      {isCapturing && (
        <div className="flex gap-2">
          <Button 
            onClick={stopCapture}
            variant="outline"
          >
            Stop Camera
          </Button>
        </div>
      )}
      
      {detectedEmotion && (
        <div className="w-full max-w-md">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Detected Emotion</h3>
            <div className="flex justify-between">
              <p>{detectedEmotion.emotion}</p>
              <p>Confidence: {Math.round(detectedEmotion.confidence * 100)}%</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              id="notes"
              className="w-full p-2 border rounded-md"
              placeholder="How are you feeling?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={saveEmotion}
            className="w-full mt-4 bg-wellness-purple hover:bg-wellness-purple-dark text-white"
          >
            Save Emotion
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;
