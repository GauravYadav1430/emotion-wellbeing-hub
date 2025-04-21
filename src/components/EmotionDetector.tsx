
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

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
    return () => {
      stopCapture();
    };
  }, [toast]);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
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
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const mapEmotionToCategory = (expression: string): string => {
    const emotionMapping: { [key: string]: string } = {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      fearful: 'Anxious',
      disgusted: 'Frustrated',
      surprised: 'Excited',
      neutral: 'Neutral'
    };
    return emotionMapping[expression] || expression;
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
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          }

          const expressions = detections.expressions;
          let highestExpression = Object.entries(expressions).reduce(
            (prev, current) => (prev[1] > current[1] ? prev : current),
            ['neutral', 0]
          );

          setDetectedEmotion({
            emotion: mapEmotionToCategory(highestExpression[0]),
            confidence: highestExpression[1]
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
        notes: notes.trim()
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Your ${detectedEmotion.emotion.toLowerCase()} emotion has been recorded`,
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
      <Card className="w-full max-w-2xl p-4">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            width={640}
            height={480}
            muted
            playsInline
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
          <div className="flex justify-center mt-4">
            <Button 
              onClick={stopCapture}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Stop Camera
            </Button>
          </div>
        )}
        
        {detectedEmotion && (
          <div className="mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Detected Emotion</h3>
              <div className="flex justify-between">
                <p>{detectedEmotion.emotion}</p>
                <p>Confidence: {Math.round(detectedEmotion.confidence * 100)}%</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Notes (optional)
              </label>
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
      </Card>
    </div>
  );
};

export default EmotionDetector;
