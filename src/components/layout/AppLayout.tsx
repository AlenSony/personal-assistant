import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-border sticky top-0 z-40 bg-background">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-md border border-border bg-card"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? "☰" : "✕"}
        </button>
        <span className="font-bold text-lg">Orbit</span>
        <ThemeToggle />
      </div>
      <div className="flex w-full">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}