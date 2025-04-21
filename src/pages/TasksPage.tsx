
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, CheckCheck } from 'lucide-react';
import TaskCard from '@/components/TaskCard';

// Sample tasks data
const initialTasks = [
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
  {
    id: '4',
    title: 'Call a friend',
    description: 'Connect with someone you care about',
    completed: false,
    category: 'social'
  },
  {
    id: '5',
    title: 'Read for 20 minutes',
    description: 'Take some time to relax with a good book',
    completed: false,
    category: 'mindfulness'
  },
  {
    id: '6',
    title: 'Organize workspace',
    description: 'Clear your desk to clear your mind',
    completed: false,
    category: 'productivity'
  },
];

// Task categories
const categories = [
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'physical', label: 'Physical' },
  { value: 'social', label: 'Social' },
  { value: 'creative', label: 'Creative' },
  { value: 'productivity', label: 'Productivity' },
];

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAddTask = () => {
    if (newTask.title && newTask.category) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        category: newTask.category
      };
      
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '', category: '' });
      setDialogOpen(false);
    }
  };

  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return task.completed;
    if (activeFilter === 'pending') return !task.completed;
    return task.category === activeFilter;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Wellness Tasks</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wellness-purple hover:bg-wellness-purple-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Wellness Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input 
                  placeholder="Task title" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea 
                  placeholder="Brief description of the task" 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(value) => setNewTask({...newTask, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full bg-wellness-purple hover:bg-wellness-purple-dark text-white"
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.category}
              >
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <Tabs 
          defaultValue="all" 
          value={activeFilter} 
          onValueChange={setActiveFilter}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCheck className="h-4 w-4 mr-1" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="hidden md:inline-flex">Mindfulness</TabsTrigger>
            <TabsTrigger value="physical" className="hidden md:inline-flex">Physical</TabsTrigger>
            <TabsTrigger value="social" className="hidden md:inline-flex">Social</TabsTrigger>
            <TabsTrigger value="creative" className="hidden md:inline-flex">Creative</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="md:hidden mt-2">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter by Category</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {activeFilter === 'all' ? 'All Tasks' : 
             activeFilter === 'completed' ? 'Completed Tasks' :
             activeFilter === 'pending' ? 'Pending Tasks' :
             `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Tasks`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleTaskComplete}
                />
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <p>No tasks found. Create a new task to get started!</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
