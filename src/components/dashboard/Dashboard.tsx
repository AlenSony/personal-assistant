import orbitAvatar from "@/assets/orbit-avatar.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { MoodChatbot } from "../ai/MoodChatbot";
import { TaskQuickAdd } from "../tasks/TaskQuickAdd";

export function Dashboard() {
  const [currentTime] = useState(new Date());
  const [userName] = useState("Friend"); // In a real app, this would come from user settings

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const todaysTasks = [
    { id: 1, title: "Meeting with Sarah at 3 PM", completed: false, priority: "high" },
    { id: 2, title: "Finish quarterly report", completed: false, priority: "medium" },
    { id: 3, title: "Call dentist for appointment", completed: true, priority: "low" },
  ];

  const upcomingTasks = todaysTasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img 
            src={orbitAvatar} 
            alt="Orbit" 
            className="w-16 h-16 rounded-full shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to make today amazing? Let's get organized! 🌟
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Mood Check-in */}
        <Card className="border-none shadow-md bg-gradient-to-br from-primary-soft to-accent">
          <CardHeader>
            <CardTitle className="text-lg text-primary-foreground">How are you feeling?</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodChatbot />
          </CardContent>
        </Card>

        {/* Quick Task Add */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Add a Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskQuickAdd />
          </CardContent>
        </Card>

        {/* Today's Focus */}
        <Card className="border-none shadow-md bg-gradient-to-br from-secondary to-muted">
          <CardHeader>
            <CardTitle className="text-lg">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {upcomingTasks.length}
              </div>
              <p className="text-sm text-muted-foreground">
                tasks remaining
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks Preview */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Tasks</span>
            <Badge variant="secondary">{todaysTasks.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${
                  task.completed
                    ? "bg-success/10 border-success/20 text-muted-foreground line-through"
                    : "bg-card border-border hover:bg-muted/50"
                } transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{task.title}</span>
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {upcomingTasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">🎉 All tasks completed!</p>
              <p className="text-sm text-muted-foreground">
                Great job today! Take some time to relax.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}