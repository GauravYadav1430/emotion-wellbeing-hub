
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import EmotionCard from '@/components/EmotionCard';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

const LogTab = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogEmotion = async () => {
    if (!selectedEmotion || !user) return;
    
    try {
      const { error } = await supabase.from('emotions').insert({
        user_id: user.id,
        emotion: selectedEmotion,
        confidence: 0.8,
        notes: note,
        created_at: date.toISOString()
      });
      
      if (error) throw error;
      
      toast({
        title: "Emotion logged",
        description: `Your ${selectedEmotion} emotion has been recorded`,
      });
      
      setSelectedEmotion(null);
      setNote('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log emotion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {emotions.map((emotion) => (
              <EmotionCard
                key={emotion.name}
                emotion={emotion}
                isSelected={selectedEmotion === emotion.name}
                onClick={() => setSelectedEmotion(emotion.name)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
                disabled={{ after: new Date() }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <Textarea
                placeholder="What made you feel this way?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-24"
              />
            </div>
          </CardContent>
        </Card>
        
        <Button 
          className="w-full bg-wellness-purple hover:bg-wellness-purple-dark text-white"
          disabled={!selectedEmotion}
          onClick={handleLogEmotion}
        >
          Log Emotion
        </Button>
      </div>
    </div>
  );
};

export default LogTab;
