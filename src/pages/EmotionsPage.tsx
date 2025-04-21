
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DetectTab from '@/components/emotions/DetectTab';
import LogTab from '@/components/emotions/LogTab';
import HistoryTab from '@/components/emotions/HistoryTab';
import TrendsTab from '@/components/emotions/TrendsTab';

const EmotionsPage: React.FC = () => {
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
    const groupedByDate = logs.reduce((acc: any, log) => {
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
        
        <TabsContent value="detect" className="mt-6">
          <DetectTab />
        </TabsContent>
        
        <TabsContent value="log" className="mt-6">
          <LogTab />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <HistoryTab emotionLogs={emotionLogs} loading={loading} />
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <TrendsTab chartData={chartData} emotionLogs={emotionLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionsPage;
