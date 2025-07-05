import orbitAvatar from "@/assets/orbit-avatar.png";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { Heart, History, Home, List, Settings as SettingsIcon, Smile } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { to: "/", icon: Home, label: "Dashboard", end: true },
  { to: "/tasks", icon: List, label: "Tasks" },
  { to: "/mood", icon: Smile, label: "Mood" },
  { to: "/wellness", icon: Heart, label: "Wellness" },
  { to: "/history", icon: History, label: "History" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-16" : "w-64",
        "md:block",
        collapsed && "hidden md:block"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src={orbitAvatar} 
            alt="Orbit Avatar" 
            className="w-8 h-8 rounded-full"
          />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">Orbit</h1>
              <p className="text-xs text-muted-foreground">Your AI companion</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="absolute top-4 right-2 w-6 h-6 p-0"
        >
          <span className="sr-only">Toggle sidebar</span>
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  "hover:bg-secondary/50",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3">
          <div className="p-3 bg-primary-soft rounded-lg">
            <p className="text-xs text-primary font-medium">
              ✨ Ready to help you stay organized and calm
            </p>
          </div>
          <div className="flex justify-center mt-2">
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Mobile overlay backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onToggle}
          aria-label="Close sidebar overlay"
        />
      )}
    </div>
  );
}