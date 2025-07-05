import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import History from "./pages/History";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import Mood from "./pages/Mood";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Wellness from "./pages/Wellness";

const queryClient = new QueryClient();

const App = () => {
  const [showLanding, setShowLanding] = useState(true);

  const handleEnterApp = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Landing onEnterApp={handleEnterApp} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="mood" element={<Mood />} />
              <Route path="wellness" element={<Wellness />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
