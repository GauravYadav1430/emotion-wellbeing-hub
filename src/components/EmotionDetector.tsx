
import React, { useRef, useState } from 'react';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const { isModelLoaded, detectEmotions } = useEmotionDetection();

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
        startDetection();
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

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detectInterval = setInterval(async () => {
      if (!isCapturing) {
        clearInterval(detectInterval);
        return;
      }

      const emotion = await detectEmotions(videoRef.current!, canvasRef.current!);
      if (emotion) {
        setDetectedEmotion(emotion);
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
        <CameraComponent
          isCapturing={isCapturing}
          onStartCapture={startCapture}
          onStopCapture={stopCapture}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />
        
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
