import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import MagazineViewer from "./pages/MagazineViewer";
import PoemView from "./pages/PoemView";   // NEW
import WritePoem from "./pages/WritePoem"; // NEW
import PrivacyPolicy from "./pages/PrivacyPolicy"; // NEW
import NotFound from "./pages/NotFound";
import { SpeedInsights } from "@vercel/speed-insights/react"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="thizagraphix-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/magazine/:id" element={<MagazineViewer />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/poem/:id" element={<PoemView />} />        {/* NEW */}
              <Route path="/write-poem" element={<WritePoem />} />     {/* NEW */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* NEW */}
              {/* Public browsing moved to the app: send old links to the home page */}
              <Route path="/songs" element={<Navigate to="/" replace />} />
              <Route path="/song/:id" element={<Navigate to="/" replace />} />
              <Route path="/magazines" element={<Navigate to="/" replace />} />
              <Route path="/poems" element={<Navigate to="/" replace />} />
              <Route path="/artist/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;