
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import EmotionCard from '@/components/EmotionCard';

// Sample emotion data
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

// Sample emotion log data
const emotionLogData = [
  { date: '2025-04-15', emotion: 'Happy', note: 'Had a great day at work!', value: 8 },
  { date: '2025-04-16', emotion: 'Calm', note: 'Meditation helped me relax', value: 7 },
  { date: '2025-04-17', emotion: 'Anxious', note: 'Big presentation tomorrow', value: 4 },
  { date: '2025-04-18', emotion: 'Happy', note: 'Presentation went well!', value: 9 },
  { date: '2025-04-19', emotion: 'Tired', note: 'Didn\'t sleep well', value: 5 },
  { date: '2025-04-20', emotion: 'Neutral', note: 'Just a regular day', value: 6 },
];

// Sample chart data
const chartData = [
  { name: 'Apr 15', happy: 8, anxious: 2, calm: 5 },
  { name: 'Apr 16', happy: 6, anxious: 3, calm: 7 },
  { name: 'Apr 17', happy: 5, anxious: 8, calm: 3 },
  { name: 'Apr 18', happy: 9, anxious: 1, calm: 6 },
  { name: 'Apr 19', happy: 5, anxious: 4, calm: 4 },
  { name: 'Apr 20', happy: 6, anxious: 3, calm: 6 },
  { name: 'Apr 21', happy: 7, anxious: 2, calm: 7 },
];

const EmotionsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [emotionLogs, setEmotionLogs] = useState(emotionLogData);

  const handleLogEmotion = () => {
    if (selectedEmotion) {
      const newLog = {
        date: format(date, 'yyyy-MM-dd'),
        emotion: selectedEmotion,
        note: note,
        value: 7, // This would be calculated based on the emotion in a real app
      };
      
      setEmotionLogs([...emotionLogs, newLog]);
      setSelectedEmotion(null);
      setNote('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Emotion Tracking</h2>
      
      <Tabs defaultValue="log">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="log">Log Emotion</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        {/* Log Emotion Tab */}
        <TabsContent value="log" className="mt-6">
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
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Emotion Log</CardTitle>
            </CardHeader>
            <CardContent>
              {emotionLogs.length > 0 ? (
                <div className="space-y-4">
                  {emotionLogs.map((log, index) => {
                    const emotionData = emotions.find(e => e.name === log.emotion);
                    const emotionIcon = emotionData?.icon || '😐';
                    const emotionColor = emotionData?.color || 'green';
                    
                    let bgColor = 'bg-wellness-purple-light';
                    if (emotionColor === 'yellow') bgColor = 'bg-wellness-yellow-light';
                    if (emotionColor === 'blue') bgColor = 'bg-wellness-blue-light';
                    if (emotionColor === 'green') bgColor = 'bg-wellness-green-light';
                    if (emotionColor === 'peach') bgColor = 'bg-wellness-peach-light';
                    
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`${bgColor} w-10 h-10 rounded-full flex items-center justify-center text-xl`}>
                              {emotionIcon}
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
                        {log.note && (
                          <div className="mt-2 text-sm text-muted-foreground ml-13">
                            "{log.note}"
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
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="happy" 
                      stroke="#F6E05E" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anxious" 
                      stroke="#FEC6A1" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calm" 
                      stroke="#63B3ED" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="stat-card">
                  <h4 className="text-lg font-medium">Most Common</h4>
                  <div className="flex items-center mt-2 gap-2">
                    <div className="bg-wellness-yellow-light w-8 h-8 rounded-full flex items-center justify-center">
                      😊
                    </div>
                    <span>Happy (42%)</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <h4 className="text-lg font-medium">Average Mood</h4>
                  <p className="text-2xl font-bold mt-2">7.3/10</p>
                </div>
                
                <div className="stat-card">
                  <h4 className="text-lg font-medium">Mood Stability</h4>
                  <p className="text-2xl font-bold mt-2">Medium</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium">Insights</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Your mood tends to improve on weekends and drops slightly on Mondays. 
                  Consider planning enjoyable activities for Monday evenings to maintain your positive emotions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionsPage;
