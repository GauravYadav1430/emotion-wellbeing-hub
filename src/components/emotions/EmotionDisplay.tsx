
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmotionData {
  emotion: string;
  confidence: number;
}

interface EmotionDisplayProps {
  emotion: EmotionData;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotion,
  notes,
  onNotesChange,
  onSave,
}) => {
  return (
    <div className="mt-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Detected Emotion</h3>
        <div className="flex justify-between">
          <p>{emotion.emotion}</p>
          <p>Confidence: {Math.round(emotion.confidence * 100)}%</p>
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
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
        />
      </div>
      
      <Button 
        onClick={onSave}
        className="w-full mt-4 bg-wellness-purple hover:bg-wellness-purple-dark text-white"
      >
        Save Emotion
      </Button>
    </div>
  );
};

export default EmotionDisplay;
