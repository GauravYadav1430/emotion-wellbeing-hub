
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendsTabProps {
  chartData: any[];
  emotionLogs: any[];
}

const TrendsTab = ({ chartData, emotionLogs }: TrendsTabProps) => {
  return (
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
                    const emotionCounts = emotionLogs.reduce((acc: any, log) => {
                      const emotion = log.emotion;
                      acc[emotion] = (acc[emotion] || 0) + 1;
                      return acc;
                    }, {});
                    
                    if (Object.keys(emotionCounts).length === 0) {
                      return <span>No data yet</span>;
                    }
                    
                    const mostCommon = Object.entries(emotionCounts).reduce((a: any, b: any) => 
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
                    ? (emotionLogs.reduce((sum: number, log: any) => sum + log.value, 0) / emotionLogs.length).toFixed(1)
                    : 'N/A'}/10
                </p>
              </div>
              
              <div className="stat-card">
                <h4 className="text-lg font-medium">Mood Stability</h4>
                <p className="text-2xl font-bold mt-2">
                  {(() => {
                    if (emotionLogs.length < 3) return 'Need more data';
                    
                    const values = emotionLogs.map((log: any) => log.value);
                    const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
                    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
                    const avgSquareDiff = squareDiffs.reduce((a: number, b: number) => a + b, 0) / squareDiffs.length;
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
  );
};

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

export default TrendsTab;
