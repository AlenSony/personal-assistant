import orbitAvatar from "@/assets/orbit-avatar.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { historyService, type HistoryEntry } from "@/services/history-service";
import { CheckCircle, Heart, RefreshCw, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MoodChatbot } from "../ai/MoodChatbot";
import { TaskQuickAdd } from "../tasks/TaskQuickAdd";

const affirmations = [
  "You are enough, just as you are.",
  "Every day is a fresh start.",
  "You have the power to create change.",
  "Small steps lead to big progress.",
  "Your feelings are valid.",
  "Breathe in calm, breathe out stress.",
  "You are doing your best, and that's enough."
];

function getMoodEmoji(label: string) {
  switch (label) {
    case "Happy": return "😊";
    case "Sad": return "😢";
    case "Angry": return "😠";
    case "Anxious": return "😨";
    case "Calm": return "😌";
    case "Stressed": return "😰";
    case "Excited": return "🤩";
    case "Grateful": return "🙏";
    case "Lonely": return "😔";
    case "Depressed": return "😞";
    default: return "😐";
  }
}

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState("Friend"); // In a real app, this would come from user settings
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistoryData(historyService.getHistory());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const affirmationTimer = setInterval(() => setAffirmationIndex(i => (i + 1) % affirmations.length), 10000);
    return () => {
      clearInterval(timer);
      clearInterval(affirmationTimer);
    };
  }, []);

  // Greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Mood trend (last 7 days)
  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const entry = historyData.find(h => {
        const hd = new Date(h.date);
        hd.setHours(0, 0, 0, 0);
        return hd.getTime() === d.getTime();
      });
      days.push({
        date: d,
        mood: entry?.mood?.label || null,
        emoji: entry?.mood ? getMoodEmoji(entry.mood.label) : "-"
      });
    }
    return days;
  }, [historyData]);

  // Current mood (today)
  const todayMood = last7[6]?.mood;
  const todayMoodEmoji = last7[6]?.emoji;

  // Task stats
  const todayEntry = historyData.find(h => {
    const hd = new Date(h.date);
    hd.setHours(0, 0, 0, 0);
    const td = new Date();
    td.setHours(0, 0, 0, 0);
    return hd.getTime() === td.getTime();
  });
  const tasksCompleted = todayEntry?.tasksCompleted || 0;
  const tasksTotal = todayEntry?.tasksTotal || 0;
  const taskProgress = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  // Streaks
  const moodStreak = useMemo(() => {
    let streak = 0;
    let lastMood = null;
    for (let i = last7.length - 1; i >= 0; i--) {
      if (!last7[i].mood) break;
      if (lastMood && last7[i].mood !== lastMood) break;
      streak++;
      lastMood = last7[i].mood;
    }
    return streak;
  }, [last7]);

  const taskStreak = useMemo(() => {
    let streak = 0;
    for (let i = last7.length - 1; i >= 0; i--) {
      const d = last7[i].date;
      const entry = historyData.find(h => {
        const hd = new Date(h.date);
        hd.setHours(0, 0, 0, 0);
        return hd.getTime() === d.getTime();
      });
      if (entry && entry.tasksTotal > 0 && entry.tasksCompleted === entry.tasksTotal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [last7, historyData]);

  // Recent activity (last 3 days)
  const recent = last7.slice(-3).reverse();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="relative">
          <img 
            src={orbitAvatar} 
            alt="Orbit" 
            className="w-16 h-16 rounded-full shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-xs">{todayMoodEmoji || "✨"}</span>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, {userName}! {todayMoodEmoji && <span>{todayMoodEmoji}</span>}
          </h1>
          <p className="text-muted-foreground mt-1">
            {affirmations[affirmationIndex]}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Add Mood
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Zap className="w-4 h-4" /> Start Breathing
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Heart className="w-4 h-4" /> Wellness Center
          </Button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mood Trend */}
        <Card className="border-none shadow-md bg-gradient-to-br from-mood-happy to-mood-calm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-16">
              {last7.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xl mb-1">{d.emoji}</span>
                  <div className={`w-3 rounded-full ${d.mood ? 'bg-primary' : 'bg-muted-foreground/20'}`} style={{ height: `${d.mood ? 32 : 12}px` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {last7.map((d, i) => (
                <span key={i}>{d.date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Progress */}
        <Card className="border-none shadow-md bg-gradient-to-br from-success to-accent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <ProgressRing progress={taskProgress} size={64} strokeWidth={7} showLabel />
              <div className="text-sm text-muted-foreground">
                {tasksCompleted} / {tasksTotal} tasks completed today
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Streak */}
        <Card className="border-none shadow-md bg-gradient-to-br from-primary to-mood-happy">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5" /> Mood Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">{moodStreak}</div>
              <div className="text-sm text-muted-foreground">days same mood</div>
            </div>
          </CardContent>
        </Card>

        {/* Task Streak */}
        <Card className="border-none shadow-md bg-gradient-to-br from-accent to-success">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5" /> Task Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-success">{taskStreak}</div>
              <div className="text-sm text-muted-foreground">days all tasks done</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {recent.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{d.emoji}</span>
                <span className="text-xs text-muted-foreground">{d.date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span className="text-xs">{d.mood || "-"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}