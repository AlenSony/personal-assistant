export interface HistoryEntry {
  date: Date;
  mood?: {
    emoji: string;
    label: string;
    confidence: number;
  };
  tasksCompleted: number;
  tasksTotal: number;
  highlights: string[];
}

export interface TaskEntry {
  id: number;
  title: string;
  category: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  dueTime?: string;
  isRecurring: boolean;
  recurringType?: "daily" | "weekly" | "monthly";
  description?: string;
  isMeeting?: boolean;
  completed: boolean;
  createdAt: Date;
}

export interface MoodEntry {
  emoji: string;
  label: string;
  confidence: number;
  timestamp: Date;
  context?: string;
}

class HistoryService {
  private readonly HISTORY_KEY = 'orbit-history';
  private readonly TASKS_KEY = 'orbit-tasks';
  private readonly MOODS_KEY = 'orbit-moods';

  // Save task to history
  saveTask(task: TaskEntry) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const history = this.getHistory();
      let todayEntry = history.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      if (!todayEntry) {
        todayEntry = {
          date: today,
          tasksCompleted: 0,
          tasksTotal: 0,
          highlights: []
        };
        history.unshift(todayEntry);
      }

      todayEntry.tasksTotal += 1;
      if (task.completed) {
        todayEntry.tasksCompleted += 1;
        todayEntry.highlights.push(`Completed: ${task.title}`);
      }

      this.saveHistory(history);
    } catch (error) {
      console.error('Error saving task to history:', error);
    }
  }

  // Save mood to history
  saveMood(mood: MoodEntry) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const history = this.getHistory();
      let todayEntry = history.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      if (!todayEntry) {
        todayEntry = {
          date: today,
          tasksCompleted: 0,
          tasksTotal: 0,
          highlights: []
        };
        history.unshift(todayEntry);
      }

      todayEntry.mood = {
        emoji: mood.emoji,
        label: mood.label,
        confidence: mood.confidence
      };

      // Add mood-related highlight
      const moodHighlight = `Mood: ${mood.label} ${mood.emoji}`;
      if (!todayEntry.highlights.includes(moodHighlight)) {
        todayEntry.highlights.unshift(moodHighlight);
      }

      this.saveHistory(history);
    } catch (error) {
      console.error('Error saving mood to history:', error);
    }
  }

  // Add custom highlight
  addHighlight(highlight: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const history = this.getHistory();
      let todayEntry = history.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      if (!todayEntry) {
        todayEntry = {
          date: today,
          tasksCompleted: 0,
          tasksTotal: 0,
          highlights: []
        };
        history.unshift(todayEntry);
      }

      if (!todayEntry.highlights.includes(highlight)) {
        todayEntry.highlights.push(highlight);
      }

      this.saveHistory(history);
    } catch (error) {
      console.error('Error adding highlight to history:', error);
    }
  }

  // Get history data
  getHistory(): HistoryEntry[] {
    try {
      const saved = localStorage.getItem(this.HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        return parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  // Save history data
  private saveHistory(history: HistoryEntry[]) {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  // Get tasks for today
  getTodayTasks(): TaskEntry[] {
    try {
      const saved = localStorage.getItem(this.TASKS_KEY);
      if (saved) {
        const tasks = JSON.parse(saved);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return tasks.filter((task: TaskEntry) => {
          const taskDate = new Date(task.createdAt);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
      }
      return [];
    } catch (error) {
      console.error('Error loading today\'s tasks:', error);
      return [];
    }
  }

  // Save task
  saveTaskToStorage(task: TaskEntry) {
    try {
      const saved = localStorage.getItem(this.TASKS_KEY);
      const tasks = saved ? JSON.parse(saved) : [];
      tasks.push(task);
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
      
      // Also save to history
      this.saveTask(task);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  // Update task completion
  updateTaskCompletion(taskId: number, completed: boolean) {
    try {
      const saved = localStorage.getItem(this.TASKS_KEY);
      if (saved) {
        const tasks = JSON.parse(saved);
        const taskIndex = tasks.findIndex((task: TaskEntry) => task.id === taskId);
        
        if (taskIndex !== -1) {
          tasks[taskIndex].completed = completed;
          localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
          
          // Update history
          this.saveTask(tasks[taskIndex]);
        }
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  }

  // Save mood to storage
  saveMoodToStorage(mood: MoodEntry) {
    try {
      const saved = localStorage.getItem(this.MOODS_KEY);
      const moods = saved ? JSON.parse(saved) : [];
      moods.push(mood);
      localStorage.setItem(this.MOODS_KEY, JSON.stringify(moods));
      
      // Also save to history
      this.saveMood(mood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    try {
      localStorage.removeItem(this.HISTORY_KEY);
      localStorage.removeItem(this.TASKS_KEY);
      localStorage.removeItem(this.MOODS_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export const historyService = new HistoryService(); 