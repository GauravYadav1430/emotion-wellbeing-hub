
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Plus, Camera } from 'lucide-react';
import EmotionCard from '@/components/EmotionCard';
import TaskCard from '@/components/TaskCard';
import StatCard from '@/components/StatCard';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

// Sample emotions data
const emotionOptions = [
  { name: 'Happy', icon: '😊', color: 'yellow' },
  { name: 'Calm', icon: '😌', color: 'blue' },
  { name: 'Sad', icon: '😔', color: 'purple' },
  { name: 'Anxious', icon: '😰', color: 'peach' },
];

// Sample tasks data
const mockTasks = [
  {
    id: '1',
    title: '5-minute meditation',
    description: 'Take a moment to breathe and center yourself',
    completed: false,
    category: 'mindfulness'
  },
  {
    id: '2',
    title: '10-minute walk',
    description: 'Get some fresh air and clear your mind',
    completed: true,
    category: 'physical'
  },
  {
    id: '3',
    title: 'Journal entry',
    description: 'Write down your thoughts and feelings',
    completed: false,
    category: 'creative'
  },
];

const Dashboard: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [moodChartData, setMoodChartData] = useState<any[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<any[]>([]);
  const [todaysEmotion, setTodaysEmotion] = useState<any | null>(null);
  const [userName, setUserName] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    // Fetch user's name
    if (user) {
      setUserName(user.email?.split('@')[0] || 'User');
    }
    
    // Fetch today's emotion if already logged
    const fetchTodaysEmotion = async () => {
      if (!user) return;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!error && data && data.length > 0) {
        setTodaysEmotion(data[0]);
      }
    };
    
    // Fetch emotion data for chart
    const fetchEmotionData = async () => {
      if (!user) return;
      
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        // Process data for chart
        const chartData = processEmotionChartData(data);
        setMoodChartData(chartData);
      }
    };
    
    // Placeholder for task completion data
    const setMockTaskData = () => {
      setTaskCompletionData([
        { name: 'Mon', value: 3 },
        { name: 'Tue', value: 5 },
        { name: 'Wed', value: 2 },
        { name: 'Thu', value: 4 },
        { name: 'Fri', value: 6 },
        { name: 'Sat', value: 3 },
        { name: 'Sun', value: 5 },
      ]);
    };
    
    fetchTodaysEmotion();
    fetchEmotionData();
    setMockTaskData();
  }, [user]);

  // Process emotion data for chart display
  const processEmotionChartData = (data: any[]) => {
    // Group by day
    const groupedByDay = data.reduce((acc, item) => {
      const day = format(new Date(item.created_at), 'ccc');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Calculate average mood score per day
    return Object.entries(groupedByDay).map(([day, emotions]) => {
      const avgValue = emotions.reduce((sum, emotion) => 
        sum + (emotion.confidence * 10), 0) / emotions.length;
      
      return {
        name: day,
        value: Math.round(avgValue * 10) / 10
      };
    });
  };

  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{getGreeting()}, {userName}</h2>
        <p className="text-muted-foreground">
          {todaysEmotion 
            ? `You're feeling ${todaysEmotion.emotion.toLowerCase()} today.` 
            : "How are you feeling today?"}
        </p>
      </div>

      <section className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Your Current Mood</h3>
            {todaysEmotion ? (
              // Display today's logged emotion
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
              // Display emotion selection
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
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Weekly Mood Score" 
          value={moodChartData.length > 0 
            ? `${(moodChartData.reduce((sum, item) => sum + item.value, 0) / moodChartData.length).toFixed(1)}/10` 
            : "No data yet"}
          change={moodChartData.length > 1 
            ? `${(moodChartData[moodChartData.length - 1].value - moodChartData[0].value).toFixed(1)} from last week` 
            : "Need more data"}
          chartData={moodChartData}
          chartColor="#9b87f5"
        />
        <StatCard 
          title="Tasks Completed" 
          value="28" 
          change="+4 from last week"
          chartData={taskCompletionData}
          chartColor="#68D391"
        />
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Today's Tasks</h3>
          <Link to="/tasks">
            <Button variant="outline" size="sm" className="gap-1">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {tasks.slice(0, 3).map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
            />
          ))}
          
          <Link to="/tasks">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Task</span>
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <Tabs defaultValue="insights">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="insights" className="p-4 bg-muted rounded-lg mt-4">
            <p className="text-sm text-muted-foreground">
              {moodChartData.length >= 3 
                ? "Based on your recent mood patterns, you tend to feel more anxious in the afternoons. Try scheduling a short break around 3 PM to reset."
                : "Log your emotions regularly to receive personalized insights about your mood patterns."}
            </p>
          </TabsContent>
          <TabsContent value="recommendations" className="p-4 bg-muted rounded-lg mt-4">
            <p className="text-sm text-muted-foreground">
              Try these activities to improve your mood:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>5-minute breathing exercise</li>
                <li>Listen to uplifting music</li>
                <li>Take a short walk outside</li>
              </ul>
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Dashboard;
