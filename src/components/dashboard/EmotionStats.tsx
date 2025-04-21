
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';
import EmotionCard from '@/components/EmotionCard';
import type { Emotion } from '@/types/emotions';

interface EmotionOption {
  name: string;
  icon: string;
  color: string;
}

interface EmotionStatsProps {
  todaysEmotion: Emotion | null;
  selectedEmotion: string | null;
  setSelectedEmotion: (emotion: string | null) => void;
}

const emotionOptions = [
  { name: 'Happy', icon: '😊', color: 'yellow' },
  { name: 'Calm', icon: '😌', color: 'blue' },
  { name: 'Sad', icon: '😔', color: 'purple' },
  { name: 'Anxious', icon: '😰', color: 'peach' },
];

const EmotionStats: React.FC<EmotionStatsProps> = ({
  todaysEmotion,
  selectedEmotion,
  setSelectedEmotion,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Your Current Mood</h3>
        {todaysEmotion ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              {(() => {
                const emotionData = emotionOptions.find(e => e.name === todaysEmotion.emotion) || 
                                  { name: todaysEmotion.emotion, icon: '😐', color: 'green' };
                
                let bgColor = 'bg-wellness-purple-light';
                if (emotionData.color === 'yellow') bgColor = 'bg-wellness-yellow-light';
                if (emotionData.color === 'blue') bgColor = 'bg-wellness-blue-light';
                if (emotionData.color === 'green') bgColor = 'bg-wellness-green-light';
                if (emotionData.color === 'peach') bgColor = 'bg-wellness-peach-light';
                
                return (
                  <div className={`${bgColor} w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4`}>
                    {emotionData.icon}
                  </div>
                );
              })()}
            </div>
            <p className="text-xl font-medium">{todaysEmotion.emotion}</p>
            {todaysEmotion.notes && (
              <p className="text-muted-foreground mt-2 italic">"{todaysEmotion.notes}"</p>
            )}
            <div className="mt-4">
              <Link to="/emotions">
                <Button variant="outline">
                  Log Another Emotion
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {emotionOptions.map((emotion) => (
                <EmotionCard
                  key={emotion.name}
                  emotion={emotion}
                  isSelected={selectedEmotion === emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center sm:justify-start space-x-4">
              <Link to="/emotions">
                <Button 
                  className="bg-wellness-purple hover:bg-wellness-purple-dark text-white"
                  disabled={!selectedEmotion}
                >
                  Log Emotion
                </Button>
              </Link>
              <Link to="/emotions?tab=detect">
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Detect with Camera</span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionStats;
