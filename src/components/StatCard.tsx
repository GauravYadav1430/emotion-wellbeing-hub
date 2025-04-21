
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  name: string;
  value: number;
}

interface StatCardProps {
  title: string;
  description?: string;
  value: string | number;
  change?: string;
  chartData?: ChartData[];
  chartColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  description,
  value,
  change,
  chartData,
  chartColor = "#9b87f5"
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <h4 className="text-2xl font-bold">{value}</h4>
          {change && (
            <span className="text-xs text-wellness-green">
              {change}
            </span>
          )}
        </div>
        
        {chartData && (
          <div className="h-[100px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={false} 
                  axisLine={false} 
                />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border p-2 rounded-md text-xs">
                          <p>{`${payload[0].payload.name}: ${payload[0].value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chartColor} 
                  fillOpacity={1} 
                  fill={`url(#color-${title})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
