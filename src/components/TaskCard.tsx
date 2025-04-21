
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    category: string;
  };
  onComplete: (id: string, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const getCategoryColor = () => {
    switch (task.category) {
      case 'mindfulness': return 'bg-wellness-purple-light text-wellness-purple-dark';
      case 'physical': return 'bg-wellness-green-light text-wellness-green-dark';
      case 'social': return 'bg-wellness-blue-light text-wellness-blue-dark';
      case 'creative': return 'bg-wellness-peach-light text-wellness-peach-dark';
      case 'productivity': return 'bg-wellness-yellow-light text-wellness-yellow-dark';
      default: return 'bg-wellness-purple-light text-wellness-purple-dark';
    }
  };

  return (
    <div className={cn(
      'task-card',
      task.completed && 'opacity-70'
    )}>
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={cn(
              "font-medium text-lg transition-all",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              getCategoryColor()
            )}>
              {task.category}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
