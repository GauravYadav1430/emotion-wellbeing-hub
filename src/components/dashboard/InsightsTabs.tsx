
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InsightsTabsProps {
  moodChartData: Array<{ name: string; value: number }>;
}

const InsightsTabs: React.FC<InsightsTabsProps> = ({ moodChartData }) => {
  return (
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
  );
};

export default InsightsTabs;
