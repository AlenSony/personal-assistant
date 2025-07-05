import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreathingTimer } from "@/components/wellness/BreathingTimer";
import { MoodJournal } from "@/components/wellness/MoodJournal";
import { WellnessChallenges } from "@/components/wellness/WellnessChallenges";
import {
    Award,
    BookOpen,
    Brain,
    Clock,
    Heart,
    MessageSquare,
    Sparkles,
    Target,
    Trophy,
    Wind
} from "lucide-react";
import { useEffect, useState } from "react";

interface WellnessStats {
  breathingSessions: number;
  breathingMinutes: number;
  journalEntries: number;
  journalWords: number;
  currentStreak: number;
  totalDays: number;
}

export default function Wellness() {
  const [activeTab, setActiveTab] = useState("breathing");
  const [stats, setStats] = useState<WellnessStats>({
    breathingSessions: 0,
    breathingMinutes: 0,
    journalEntries: 0,
    journalWords: 0,
    currentStreak: 0,
    totalDays: 0
  });

  // Load wellness stats
  useEffect(() => {
    const breathingSessions = parseInt(localStorage.getItem('breathing-sessions') || '0');
    const breathingMinutes = parseInt(localStorage.getItem('breathing-minutes') || '0');
    
    const journalEntries = JSON.parse(localStorage.getItem('mood-journal-entries') || '[]');
    const journalWords = journalEntries.reduce((total: number, entry: any) => total + (entry.wordCount || 0), 0);
    
    // Calculate streak (simplified - could be more sophisticated)
    const totalDays = Math.max(breathingSessions, journalEntries.length);
    const currentStreak = Math.min(totalDays, 7); // Simplified streak calculation
    
    setStats({
      breathingSessions,
      breathingMinutes,
      journalEntries: journalEntries.length,
      journalWords,
      currentStreak,
      totalDays
    });
  }, []);

  const wellnessFeatures = [
    {
      id: "breathing",
      title: "Breathing Exercises",
      description: "Guided breathing techniques for relaxation and focus",
      icon: <Wind className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      stats: [
        { label: "Sessions", value: stats.breathingSessions, icon: <Clock className="w-4 h-4" /> },
        { label: "Minutes", value: stats.breathingMinutes, icon: <Target className="w-4 h-4" /> }
      ]
    },
    {
      id: "journal",
      title: "Mood Journal",
      description: "Reflect on your thoughts and feelings with AI insights",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-purple-500 to-violet-500",
      stats: [
        { label: "Entries", value: stats.journalEntries, icon: <MessageSquare className="w-4 h-4" /> },
        { label: "Words", value: stats.journalWords, icon: <Brain className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Wellness Center
            </h1>
            <p className="text-lg text-muted-foreground">
              Your comprehensive mental wellness toolkit
            </p>
          </div>
        </div>
        
        {/* Wellness Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Total Sessions</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.breathingSessions + stats.journalEntries}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Breathing Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.breathingMinutes}m
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Words Written</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.journalWords}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.currentStreak} days
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wellnessFeatures.map((feature) => (
          <Card 
            key={feature.id}
            className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setActiveTab(feature.id)}
          >
            <CardContent className="p-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <div className="flex gap-4">
                {feature.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {stat.icon}
                    <div>
                      <div className="text-sm font-medium">{stat.label}</div>
                      <div className="text-lg font-bold">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Card className="border-none shadow-xl">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Breathing
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Journal
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Challenges
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="breathing" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Mindful Breathing Exercises
                </h2>
                <p className="text-muted-foreground">
                  Choose from various breathing techniques to reduce stress and improve focus
                </p>
              </div>
              <BreathingTimer />
            </TabsContent>
            
            <TabsContent value="journal" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Mood Journal
                </h2>
                <p className="text-muted-foreground">
                  Reflect on your thoughts, feelings, and experiences with guided prompts
                </p>
              </div>
              <MoodJournal />
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Wellness Challenges
                </h2>
                <p className="text-muted-foreground">
                  Complete daily and weekly challenges to build healthy habits and earn achievements
                </p>
              </div>
              <WellnessChallenges />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Wellness Tips */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            Daily Wellness Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <h4 className="font-semibold">Start Your Day Mindfully</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Take 5 minutes each morning for deep breathing or journaling to set a positive tone for your day.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <h4 className="font-semibold">Track Your Progress</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Regular journaling helps identify patterns in your mood and emotional responses over time.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <h4 className="font-semibold">Build Consistency</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Small daily practices create lasting habits. Even 5 minutes of breathing or journaling makes a difference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 