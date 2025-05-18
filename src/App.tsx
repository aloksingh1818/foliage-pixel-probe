
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Initialize the Query Client
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Initialize PWA elements if on a mobile device
  React.useEffect(() => {
    const initializePWA = async () => {
      try {
        if (window && window.hasOwnProperty('Capacitor')) {
          // Define the elements for camera functionality if needed
          console.log("Capacitor detected - running as a mobile app");
        }
      } catch (error) {
        console.error("Error initializing PWA elements:", error);
      }
    };

    initializePWA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
