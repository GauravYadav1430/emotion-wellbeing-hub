
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, LineChart, Award, Settings, Bell } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://github.com/shadcn.png" alt="User profile" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-3xl font-bold">John Doe</h2>
          <p className="text-muted-foreground">Member since April 2025</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="bg-wellness-purple-light text-wellness-purple-dark border-wellness-purple">
              28-Day Streak
            </Badge>
            <Badge variant="outline" className="bg-wellness-green-light text-wellness-green-dark border-wellness-green">
              Mindfulness Expert
            </Badge>
            <Badge variant="outline" className="bg-wellness-blue-light text-wellness-blue-dark border-wellness-blue">
              Mood Tracker
            </Badge>
          </div>
        </div>
        
        <Button variant="outline" className="md:self-start">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-wellness-purple-light text-wellness-purple p-3 rounded-full mb-3">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">468</h3>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-wellness-green-light text-wellness-green p-3 rounded-full mb-3">
                <CalendarCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">28</h3>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-wellness-blue-light text-wellness-blue p-3 rounded-full mb-3">
                <LineChart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">85%</h3>
              <p className="text-sm text-muted-foreground">Task Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="achievements">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Badges and milestones you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Meditation Master', 'Early Riser', 'Mood Tracker', 'Task Champion', 'Week Warrior', 'Journal Keeper', 'Mindfulness Pro', 'Consistency King'].map((achievement, index) => (
                  <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 ${
                      index % 4 === 0 ? 'bg-wellness-purple-light' :
                      index % 4 === 1 ? 'bg-wellness-green-light' :
                      index % 4 === 2 ? 'bg-wellness-blue-light' :
                      'bg-wellness-peach-light'
                    }`}>
                      🏆
                    </div>
                    <h4 className="font-medium text-center text-sm">{achievement}</h4>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
              <CardDescription>Detailed insights about your wellness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Most Common Emotions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-wellness-yellow-light w-8 h-8 rounded-full flex items-center justify-center">
                        😊
                      </div>
                      <div>
                        <p className="font-medium">Happy</p>
                        <p className="text-xs text-muted-foreground">42%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-wellness-blue-light w-8 h-8 rounded-full flex items-center justify-center">
                        😌
                      </div>
                      <div>
                        <p className="font-medium">Calm</p>
                        <p className="text-xs text-muted-foreground">28%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-wellness-peach-light w-8 h-8 rounded-full flex items-center justify-center">
                        😰
                      </div>
                      <div>
                        <p className="font-medium">Anxious</p>
                        <p className="text-xs text-muted-foreground">15%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-wellness-purple-light w-8 h-8 rounded-full flex items-center justify-center">
                        😔
                      </div>
                      <div>
                        <p className="font-medium">Sad</p>
                        <p className="text-xs text-muted-foreground">10%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Task Completion by Category</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium text-wellness-purple">Mindfulness</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium text-wellness-green">Physical</p>
                      <p className="text-2xl font-bold">78%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium text-wellness-blue">Social</p>
                      <p className="text-2xl font-bold">65%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium text-wellness-peach">Creative</p>
                      <p className="text-2xl font-bold">87%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium text-wellness-yellow">Productivity</p>
                      <p className="text-2xl font-bold">81%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-wellness-purple" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive daily reminders</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <LineChart className="h-5 w-5 text-wellness-purple" />
                    <div>
                      <p className="font-medium">Data Privacy</p>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                    </div>
                  </div>
                  <Button variant="outline">Settings</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-wellness-purple" />
                    <div>
                      <p className="font-medium">Account Details</p>
                      <p className="text-sm text-muted-foreground">Update your personal information</p>
                    </div>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
                
                <Button className="w-full" variant="destructive">Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
