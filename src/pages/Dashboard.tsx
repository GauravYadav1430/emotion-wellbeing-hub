
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Plus } from 'lucide-react';
import EmotionCard from '@/components/EmotionCard';
import TaskCard from '@/components/TaskCard';
import StatCard from '@/components/StatCard';

// Sample data - in a real app, this would come from a database
const mockEmotions = [
  { name: 'Happy', icon: '😊', color: 'yellow' },
  { name: 'Calm', icon: '😌', color: 'blue' },
  { name: 'Sad', icon: '😔', color: 'purple' },
  { name: 'Anxious', icon: '😰', color: 'peach' },
];

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

const moodChartData = [
  { name: 'Mon', value: 7 },
  { name: 'Tue', value: 5 },
  { name: 'Wed', value: 8 },
  { name: 'Thu', value: 6 },
  { name: 'Fri', value: 9 },
  { name: 'Sat', value: 8 },
  { name: 'Sun', value: 7 },
];

const taskCompletionData = [
  { name: 'Mon', value: 3 },
  { name: 'Tue', value: 5 },
  { name: 'Wed', value: 2 },
  { name: 'Thu', value: 4 },
  { name: 'Fri', value: 6 },
  { name: 'Sat', value: 3 },
  { name: 'Sun', value: 5 },
];

const Dashboard: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [tasks, setTasks] = useState(mockTasks);

  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-muted-foreground">How are you feeling today?</p>
      </div>

      <section className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Your Current Mood</h3>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {mockEmotions.map((emotion) => (
                <EmotionCard
                  key={emotion.name}
                  emotion={emotion}
                  isSelected={selectedEmotion === emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                />
              ))}
            </div>
            <div className="mt-4 text-center sm:text-left">
              <Button 
                className="bg-wellness-purple hover:bg-wellness-purple-dark text-white"
                disabled={!selectedEmotion}
              >
                Log Emotion
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Weekly Mood Score" 
          value="7.2/10" 
          change="+0.5 from last week"
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
              Based on your recent mood patterns, you tend to feel more anxious in the afternoons.
              Try scheduling a short break around 3 PM to reset.
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
