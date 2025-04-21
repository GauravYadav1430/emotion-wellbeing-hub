
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmotionDetector from '@/components/EmotionDetector';

const DetectTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detect Your Emotion</CardTitle>
      </CardHeader>
      <CardContent>
        <EmotionDetector />
      </CardContent>
    </Card>
  );
};

export default DetectTab;
