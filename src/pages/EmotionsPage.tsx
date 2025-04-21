
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import EmotionCard from '@/components/EmotionCard';
import EmotionDetector from '@/components/EmotionDetector';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

const EmotionsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [emotionLogs, setEmotionLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch emotion logs from the database
  useEffect(() => {
    const fetchEmotionLogs = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // Format the data for display
          const formattedData = data.map(log => ({
            ...log,
            date: format(new Date(log.created_at), 'yyyy-MM-dd'),
            value: Math.round(log.confidence * 10) // Convert confidence to a 0-10 scale
          }));
          
          setEmotionLogs(formattedData);
          
          // Process chart data
          processChartData(formattedData);
        }
      } catch (error: any) {
        console.error('Error fetching emotion logs:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch emotion logs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmotionLogs();
  }, [user]);

  // Process and prepare chart data
  const processChartData = (logs: any[]) => {
    // Group by date
    const groupedByDate = logs.reduce((acc, log) => {
      const date = format(new Date(log.created_at), 'MMM dd');
      if (!acc[date]) {
        acc[date] = {};
      }
      
      // Lowercase the emotion for consistency
      const emotion = log.emotion.toLowerCase();
      
      // Sum up the values (we'll average them later)
      if (!acc[date][emotion]) {
        acc[date][emotion] = { sum: log.value, count: 1 };
      } else {
        acc[date][emotion].sum += log.value;
        acc[date][emotion].count += 1;
      }
      
      return acc;
    }, {});
    
    // Convert to chart data format with averages
    const chartData = Object.keys(groupedByDate).map(date => {
      const entry: any = { name: date };
      
      // Calculate averages for each emotion
      Object.keys(groupedByDate[date]).forEach(emotion => {
        const { sum, count } = groupedByDate[date][emotion];
        entry[emotion] = Math.round(sum / count);
      });
      
      return entry;
    });
    
    // Sort by date
    chartData.sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Get the most recent 7 days of data
    const recentData = chartData.slice(-7);
    
    setChartData(recentData);
  };

  // Manual log emotion
  const handleLogEmotion = async () => {
    if (!selectedEmotion || !user) return;
    
    try {
      const { error } = await supabase.from('emotions').insert({
        user_id: user.id,
        emotion: selectedEmotion,
        confidence: 0.8, // Default confidence for manual entries
        notes: note,
        created_at: date.toISOString() // Use the selected date
      });
      
      if (error) throw error;
      
      toast({
        title: "Emotion logged",
        description: `Your ${selectedEmotion} emotion has been recorded`,
      });
      
      // Refresh emotion logs
      const { data, error: fetchError } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      if (data) {
        const formattedData = data.map(log => ({
          ...log,
          date: format(new Date(log.created_at), 'yyyy-MM-dd'),
          value: Math.round(log.confidence * 10)
        }));
        
        setEmotionLogs(formattedData);
        processChartData(formattedData);
      }
      
      // Reset form
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
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Emotion Tracking</h2>
      
      <Tabs defaultValue="detect">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="detect">Detect Emotion</TabsTrigger>
          <TabsTrigger value="log">Log Manually</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        {/* Detect Emotion Tab */}
        <TabsContent value="detect" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detect Your Emotion</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionDetector />
            </CardContent>
          </Card>
        </TabsContent>
        
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
                            <div className={`${bgColor} w-10 h-10 rounded-full flex items-center justify-center text-xl`}>
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
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        {['happy', 'excited'].some(emotion => 
                          chartData.some(data => data[emotion] !== undefined)) && (
                          <Line 
                            type="monotone" 
                            dataKey="happy" 
                            stroke="#F6E05E" 
                            strokeWidth={2} 
                            name="Happy"
                            connectNulls
                          />
                        )}
                        {['anxious', 'frustrated', 'angry'].some(emotion => 
                          chartData.some(data => data[emotion] !== undefined)) && (
                          <Line 
                            type="monotone" 
                            dataKey="anxious" 
                            stroke="#FEC6A1" 
                            strokeWidth={2}
                            name="Anxious" 
                            connectNulls
                          />
                        )}
                        {['calm', 'relaxed'].some(emotion => 
                          chartData.some(data => data[emotion] !== undefined)) && (
                          <Line 
                            type="monotone" 
                            dataKey="calm" 
                            stroke="#63B3ED" 
                            strokeWidth={2} 
                            name="Calm"
                            connectNulls
                          />
                        )}
                        {['sad'].some(emotion => 
                          chartData.some(data => data[emotion] !== undefined)) && (
                          <Line 
                            type="monotone" 
                            dataKey="sad" 
                            stroke="#9F7AEA" 
                            strokeWidth={2} 
                            name="Sad"
                            connectNulls
                          />
                        )}
                        {['neutral'].some(emotion => 
                          chartData.some(data => data[emotion] !== undefined)) && (
                          <Line 
                            type="monotone" 
                            dataKey="neutral" 
                            stroke="#A0AEC0" 
                            strokeWidth={2} 
                            name="Neutral"
                            connectNulls
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <div className="stat-card">
                      <h4 className="text-lg font-medium">Most Common</h4>
                      <div className="flex items-center mt-2 gap-2">
                        {(() => {
                          // Calculate most common emotion
                          const emotionCounts = emotionLogs.reduce((acc, log) => {
                            const emotion = log.emotion;
                            acc[emotion] = (acc[emotion] || 0) + 1;
                            return acc;
                          }, {});
                          
                          if (Object.keys(emotionCounts).length === 0) {
                            return <span>No data yet</span>;
                          }
                          
                          const mostCommon = Object.entries(emotionCounts).reduce((a, b) => 
                            a[1] > b[1] ? a : b
                          );
                          
                          const emotionData = emotions.find(e => e.name === mostCommon[0]) || 
                                            { name: mostCommon[0], icon: '😐', color: 'green' };
                          
                          let bgColor = 'bg-wellness-purple-light';
                          if (emotionData.color === 'yellow') bgColor = 'bg-wellness-yellow-light';
                          if (emotionData.color === 'blue') bgColor = 'bg-wellness-blue-light';
                          if (emotionData.color === 'green') bgColor = 'bg-wellness-green-light';
                          if (emotionData.color === 'peach') bgColor = 'bg-wellness-peach-light';
                          
                          const percentage = Math.round((mostCommon[1] as number) / emotionLogs.length * 100);
                          
                          return (
                            <>
                              <div className={`${bgColor} w-8 h-8 rounded-full flex items-center justify-center`}>
                                {emotionData.icon}
                              </div>
                              <span>{emotionData.name} ({percentage}%)</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <h4 className="text-lg font-medium">Average Mood</h4>
                      <p className="text-2xl font-bold mt-2">
                        {emotionLogs.length > 0
                          ? (emotionLogs.reduce((sum, log) => sum + log.value, 0) / emotionLogs.length).toFixed(1)
                          : 'N/A'}/10
                      </p>
                    </div>
                    
                    <div className="stat-card">
                      <h4 className="text-lg font-medium">Mood Stability</h4>
                      <p className="text-2xl font-bold mt-2">
                        {(() => {
                          if (emotionLogs.length < 3) return 'Need more data';
                          
                          // Calculate standard deviation of mood values
                          const values = emotionLogs.map(log => log.value);
                          const avg = values.reduce((a, b) => a + b, 0) / values.length;
                          const squareDiffs = values.map(value => Math.pow(value - avg, 2));
                          const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
                          const stdDev = Math.sqrt(avgSquareDiff);
                          
                          if (stdDev < 1.5) return 'High';
                          if (stdDev < 3) return 'Medium';
                          return 'Low';
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">Insights</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {emotionLogs.length < 5 
                        ? 'Log more emotions to receive personalized insights about your mood patterns.'
                        : 'Based on your recent logs, your mood tends to be higher in the mornings. Consider scheduling important tasks during this time for optimal results.'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No emotion data available yet. Start tracking your emotions to see trends over time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionsPage;
