
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from 'lucide-react';
import TaskCard from '@/components/TaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}

interface TasksListProps {
  tasks: Task[];
  onTaskComplete: (id: string, completed: boolean) => void;
}

const TasksList: React.FC<TasksListProps> = ({ tasks, onTaskComplete }) => {
  return (
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
            onComplete={onTaskComplete}
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
  );
};

export default TasksList;
