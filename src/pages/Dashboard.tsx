
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import EmotionStats from '@/components/dashboard/EmotionStats';
import TasksList from '@/components/dashboard/TasksList';
import InsightsTabs from '@/components/dashboard/InsightsTabs';
import StatCard from '@/components/StatCard';
import type { Emotion } from '@/types/emotions';

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
  const [moodChartData, setMoodChartData] = useState<Array<{ name: string; value: number }>>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<Array<{ name: string; value: number }>>([]);
  const [todaysEmotion, setTodaysEmotion] = useState<Emotion | null>(null);
  const [userName, setUserName] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserName(user.email?.split('@')[0] || 'User');
    }
    
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
        setTodaysEmotion(data[0] as Emotion);
      }
    };
    
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
        const chartData = processEmotionChartData(data as Emotion[]);
        setMoodChartData(chartData);
      }
    };
    
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

  const processEmotionChartData = (data: Emotion[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const groupedByDay = data.reduce((acc: Record<string, Emotion[]>, item) => {
      const day = format(new Date(item.created_at), 'ccc');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {});
    
    return Object.entries(groupedByDay).map(([day, emotions]) => {
      const avgValue = emotions.reduce((sum, emotion) => 
        sum + (emotion.confidence * 10), 0) / emotions.length;
      
      return {
        name: day,
        value: isNaN(avgValue) ? 0 : Math.round(avgValue * 10) / 10
      };
    });
  };

  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

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
        <EmotionStats
          todaysEmotion={todaysEmotion}
          selectedEmotion={selectedEmotion}
          setSelectedEmotion={setSelectedEmotion}
        />
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

      <TasksList tasks={tasks} onTaskComplete={handleTaskComplete} />

      <section>
        <InsightsTabs moodChartData={moodChartData} />
      </section>
    </div>
  );
};

export default Dashboard;
