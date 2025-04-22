
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface CameraProps {
  isCapturing: boolean;
  onStartCapture: () => void;
  onStopCapture: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CameraComponent: React.FC<CameraProps> = ({
  isCapturing,
  onStartCapture,
  onStopCapture,
  videoRef,
  canvasRef,
}) => {
  // Check for MediaDevices support
  const isCameraSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  
  return (
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
      
      {!isCapturing ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
          {!isCameraSupported ? (
            <div className="text-center p-4">
              <p className="text-white mb-2">Camera access is not supported in this browser</p>
              <p className="text-white/70 text-sm">Please try a modern browser like Chrome, Firefox, or Edge</p>
            </div>
          ) : (
            <Button 
              onClick={onStartCapture}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          )}
        </div>
      ) : (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Button 
            onClick={onStopCapture}
            variant="outline"
            className="w-full mx-4 sm:w-auto bg-white/80 hover:bg-white"
          >
            <CameraOff className="w-4 h-4 mr-2" />
            Stop Camera
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
