import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bot, Palette, Settings as SettingsIcon, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Orbit Flow Mind experience ⚙️
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                🌙 Dark mode provides a more comfortable experience in low-light environments
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Local Storage</h4>
                  <p className="text-xs text-muted-foreground">
                    All data is stored locally on your device
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">No Data Collection</h4>
                  <p className="text-xs text-muted-foreground">
                    We don't collect or share your personal information
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Secure AI Processing</h4>
                  <p className="text-xs text-muted-foreground">
                    Your conversations are processed securely through Google's Gemini AI
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-medium text-sm text-primary">Advanced Mood Analysis</h4>
                <p className="text-xs text-primary-foreground mt-1">
                  Powered by Google's Gemini AI for sophisticated emotional intelligence
                </p>
              </div>
              
              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <h4 className="font-medium text-sm text-secondary-foreground">Conversation Memory</h4>
                <p className="text-xs text-secondary-foreground mt-1">
                  AI remembers your conversation context for more meaningful interactions
                </p>
              </div>
              
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-medium text-sm text-accent-foreground">Resource Recommendations</h4>
                <p className="text-xs text-accent-foreground mt-1">
                  Get helpful resources and support when you're feeling down
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              About Orbit Flow Mind
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  Orbit Flow Mind is your AI-powered companion for mental wellness and productivity.
                </p>
                <p className="mb-2">
                  Features include:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>AI-powered mood analysis and support</li>
                  <li>Task management and organization</li>
                  <li>Progress tracking and insights</li>
                  <li>Personalized recommendations</li>
                </ul>
              </div>
              
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-xs text-success-foreground">
                  ✨ Built with React, TypeScript, and Google's Gemini AI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 