
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from '@/lib/utils';

interface HistoryTabProps {
  emotionLogs: any[];
  loading: boolean;
}

const HistoryTab = ({ emotionLogs, loading }: HistoryTabProps) => {
  const emotions = [
    { name: 'Happy', icon: '😊', color: 'yellow' },
    { name: 'Excited', icon: '😃', color: 'yellow' },
    { name: 'Calm', icon: '😌', color: 'blue' },
    { name: 'Relaxed', icon: '🧘', color: 'blue' },
    { name: 'Neutral', icon: '😐', color: 'green' },
    { name: 'Tired', icon: '😴', color: 'green' },
    { name: 'Sad', icon: '😔', color: 'purple' },
    { name: 'Frustrated', icon: '😤', color: 'peach' },
    { name: 'Anxious', icon: '😰', color: 'peach' },
    { name: 'Angry', icon: '😠', color: 'peach' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Emotion Log</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center p-8">
            <p>Loading your emotion logs...</p>
          </div>
        ) : emotionLogs.length > 0 ? (
          <div className="space-y-4">
            {emotionLogs.map((log, index) => {
              const emotionData = emotions.find(e => e.name === log.emotion) || 
                                { name: log.emotion, icon: '😐', color: 'green' };
              
              let bgColor = 'bg-wellness-purple-light';
              if (emotionData.color === 'yellow') bgColor = 'bg-wellness-yellow-light';
              if (emotionData.color === 'blue') bgColor = 'bg-wellness-blue-light';
              if (emotionData.color === 'green') bgColor = 'bg-wellness-green-light';
              if (emotionData.color === 'peach') bgColor = 'bg-wellness-peach-light';
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn(`${bgColor} w-10 h-10 rounded-full flex items-center justify-center text-xl`)}>
                        {emotionData.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{log.emotion}</h4>
                        <p className="text-sm text-muted-foreground">{log.date}</p>
                      </div>
                    </div>
                    <div className="bg-muted text-sm px-2 py-1 rounded font-medium">
                      {log.value}/10
                    </div>
                  </div>
                  {log.notes && (
                    <div className="mt-2 text-sm text-muted-foreground ml-13">
                      "{log.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>No emotion logs yet. Start tracking how you feel!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
