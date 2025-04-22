
import React, { useRef, useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CameraComponent from './emotions/Camera';
import EmotionDisplay from './emotions/EmotionDisplay';
import { useEmotionDetection, EmotionData } from '@/hooks/useEmotionDetection';

const EmotionDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionData | null>(null);
  const [notes, setNotes] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isModelLoaded, detectEmotions } = useEmotionDetection();

  // Check if models are loaded when component mounts
  useEffect(() => {
    if (!isModelLoaded) {
      console.log("Face detection models are not loaded yet");
    } else {
      console.log("Face detection models loaded successfully");
    }
  }, [isModelLoaded]);

  const startCapture = async () => {
    setCameraError(null);
    
    if (!isModelLoaded) {
      toast({
        title: "Models not loaded",
        description: "Please wait for the emotion detection models to load or refresh the page",
        variant: "destructive",
      });
      console.error("Face detection models are not loaded");
      return;
    }

    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Camera stream set to video element");
        
        // Make sure video is playing before starting detection
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            console.log("Video playback started");
            setIsCapturing(true);
            startDetection();
          } catch (playError) {
            console.error("Error playing video:", playError);
            setCameraError("Could not play video stream. Please try again.");
            stopCapture();
          }
        };
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      let errorMessage = "Could not access your camera. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Camera access was denied. Please check your browser permissions.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (error.name === 'NotReadableError') {
        errorMessage += "Camera is already in use by another application.";
      } else {
        errorMessage += "Please check permissions and try again.";
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera error",
        description: errorMessage,
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
    console.log("Camera capture stopped");
  };

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas reference not available");
      return;
    }

    console.log("Starting emotion detection...");
    const detectInterval = setInterval(async () => {
      if (!isCapturing) {
        clearInterval(detectInterval);
        console.log("Detection interval cleared");
        return;
      }

      try {
        const emotion = await detectEmotions(videoRef.current!, canvasRef.current!);
        if (emotion) {
          console.log("Detected emotion:", emotion);
          setDetectedEmotion(emotion);
        }
      } catch (error) {
        console.error("Error during emotion detection:", error);
      }
    }, 200); // Slowed down detection interval to reduce processing load

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
        {cameraError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p className="font-medium">Camera Error</p>
            <p className="text-sm mt-1">{cameraError}</p>
          </div>
        )}
        
        <CameraComponent
          isCapturing={isCapturing}
          onStartCapture={startCapture}
          onStopCapture={stopCapture}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />
        
        {isModelLoaded ? (
          <div className="mt-2 text-center text-sm text-green-600">
            Face detection models loaded successfully
          </div>
        ) : (
          <div className="mt-2 text-center text-sm text-amber-600">
            Loading face detection models... This may take a moment
          </div>
        )}
        
        {detectedEmotion && (
          <EmotionDisplay
            emotion={detectedEmotion}
            notes={notes}
            onNotesChange={setNotes}
            onSave={saveEmotion}
          />
        )}
      </Card>
    </div>
  );
};

export default EmotionDetector;
