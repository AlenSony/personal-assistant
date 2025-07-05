import orbitAvatar from "@/assets/orbit-avatar.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { historyService, type HistoryEntry } from "@/services/history-service";
import {
    Activity,
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    RefreshCw,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function getMoodColor(label: string) {
  switch (label) {
    case "Happy": return "from-yellow-400 to-orange-400";
    case "Sad": return "from-blue-400 to-indigo-400";
    case "Angry": return "from-red-400 to-pink-400";
    case "Anxious": return "from-purple-400 to-pink-400";
    case "Calm": return "from-green-400 to-teal-400";
    case "Stressed": return "from-orange-400 to-red-400";
    case "Excited": return "from-pink-400 to-purple-400";
    case "Grateful": return "from-emerald-400 to-green-400";
    case "Lonely": return "from-gray-400 to-blue-400";
    case "Depressed": return "from-gray-500 to-gray-600";
    default: return "from-gray-300 to-gray-400";
  }
}

export function Dashboard() {
  const navigate = useNavigate();
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

  // Weekly mood distribution
  const moodDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    last7.forEach(day => {
      if (day.mood) {
        distribution[day.mood] = (distribution[day.mood] || 0) + 1;
      }
    });
    return distribution;
  }, [last7]);

  // Navigation handlers
  const handleAddMood = () => {
    navigate('/mood');
  };

  const handleStartBreathing = () => {
    navigate('/wellness');
  };

  const handleWellnessCenter = () => {
    navigate('/wellness');
  };

  const handleViewTasks = () => {
    navigate('/tasks');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Header with Enhanced Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <img 
              src={orbitAvatar} 
              alt="Orbit" 
              className="relative w-20 h-20 rounded-full shadow-2xl border-4 border-background transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-background flex items-center justify-center shadow-lg">
              <span className="text-sm">{todayMoodEmoji || "✨"}</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {getGreeting()}, {userName}! {todayMoodEmoji && <span className="inline-block animate-bounce">{todayMoodEmoji}</span>}
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              {affirmations[affirmationIndex]}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleAddMood}
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" /> Add Mood
            </Button>
            <Button 
              onClick={handleStartBreathing}
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5" /> Start Breathing
            </Button>
            <Button 
              onClick={handleWellnessCenter}
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-5 h-5" /> Wellness Center
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Overview Grid with Better Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Mood Trend with Enhanced Visualization */}
        <Card className="group border-none shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer" onClick={handleViewHistory}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <TrendingUp className="w-5 h-5" /> Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-end gap-3 h-20 mb-4">
              {last7.map((d, i) => (
                <div key={i} className="flex flex-col items-center group/item">
                  <span className="text-2xl mb-2 transition-transform duration-300 group-hover/item:scale-125">{d.emoji}</span>
                  <div 
                    className={`w-4 rounded-full transition-all duration-500 ${
                      d.mood 
                        ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} 
                    style={{ 
                      height: `${d.mood ? 40 + (i * 2) : 16}px`,
                      minHeight: '16px'
                    }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {last7.map((d, i) => (
                <span key={i} className="font-medium">{d.date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Progress with Enhanced Ring */}
        <Card className="group border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer" onClick={handleViewTasks}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" /> Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <ProgressRing 
                  progress={taskProgress} 
                  size={80} 
                  strokeWidth={8} 
                  showLabel 
                  className="drop-shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {tasksCompleted} / {tasksTotal}
                </div>
                <div className="text-sm text-muted-foreground">
                  tasks completed today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Streak with Fire Effect */}
        <Card className="group border-none shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer" onClick={handleAddMood}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <Heart className="w-5 h-5" /> Mood Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 animate-pulse">
                  {moodStreak}
                </div>
                <div className="absolute -top-2 -right-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  days same mood
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Keep it up! 🔥
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Streak with Achievement Badge */}
        <Card className="group border-none shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer" onClick={handleViewTasks}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <RefreshCw className="w-5 h-5" /> Task Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {taskStreak}
                </div>
                <div className="absolute -top-2 -right-2">
                  <Award className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  days all tasks done
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Amazing progress! 🎯
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Distribution Chart */}
      {Object.keys(moodDistribution).length > 0 && (
        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 overflow-hidden cursor-pointer" onClick={handleViewHistory}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <BarChart3 className="w-5 h-5" /> Weekly Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.entries(moodDistribution).map(([mood, count]) => (
                <div key={mood} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-all duration-300 hover:scale-105">
                  <span className="text-3xl">{getMoodEmoji(mood)}</span>
                  <div className="text-center">
                    <div className="font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground">{mood}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions & Activity with Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Check-in with Enhanced Design */}
        <Card className="group border-none shadow-xl bg-gradient-to-br from-primary/10 to-accent/10 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="text-xl text-primary-foreground flex items-center gap-2">
              <Activity className="w-6 h-6" /> How are you feeling?
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <MoodChatbot />
          </CardContent>
        </Card>

        {/* Quick Task Add with Enhanced Design */}
        <Card className="group border-none shadow-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-6 h-6" /> Add a Task
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <TaskQuickAdd />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity with Enhanced Timeline */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 overflow-hidden cursor-pointer" onClick={handleViewHistory}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Calendar className="w-5 h-5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 justify-center">
            {recent.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group">
                <div className="relative">
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-125">{d.emoji}</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-background"></div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">
                    {d.date.toLocaleDateString(undefined, { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {d.mood || "No mood recorded"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}