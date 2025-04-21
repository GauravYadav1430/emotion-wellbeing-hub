
import React from 'react';
import { cn } from '@/lib/utils';

interface EmotionCardProps {
  emotion: {
    name: string;
    icon: string;
    color: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const EmotionCard: React.FC<EmotionCardProps> = ({ 
  emotion, 
  isSelected = false,
  onClick 
}) => {
  const getBackgroundColor = () => {
    switch (emotion.color) {
      case 'purple': return 'bg-wellness-purple-light';
      case 'green': return 'bg-wellness-green-light';
      case 'blue': return 'bg-wellness-blue-light';
      case 'peach': return 'bg-wellness-peach-light';
      case 'yellow': return 'bg-wellness-yellow-light';
      default: return 'bg-wellness-purple-light';
    }
  };

  const getBorderColor = () => {
    switch (emotion.color) {
      case 'purple': return 'border-wellness-purple';
      case 'green': return 'border-wellness-green';
      case 'blue': return 'border-wellness-blue';
      case 'peach': return 'border-wellness-peach';
      case 'yellow': return 'border-wellness-yellow';
      default: return 'border-wellness-purple';
    }
  };

  return (
    <button
      className={cn(
        'emotion-card h-28 w-28',
        getBackgroundColor(),
        isSelected && `border-2 ${getBorderColor()} scale-105`
      )}
      onClick={onClick}
    >
      <div className="text-3xl mb-2">{emotion.icon}</div>
      <span className="font-medium text-sm">{emotion.name}</span>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );
};

export default EmotionCard;
