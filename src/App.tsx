import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Magazines from "./pages/Magazines";
import MagazineViewer from "./pages/MagazineViewer";
import ArtistProfile from "./pages/ArtistProfile";
import Poems from "./pages/Poems";          // NEW
import PoemView from "./pages/PoemView";   // NEW
import WritePoem from "./pages/WritePoem"; // NEW
import NotFound from "./pages/NotFound";
import { SpeedInsights } from "@vercel/speed-insights/react"
import SongView from "./pages/SongView";
import Songs from "./pages/Songs";

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
              <Route path="/songs" element={<Songs />} />
              <Route path="/song/:id" element={<SongView />} />
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/magazines" element={<Magazines />} />
              <Route path="/magazine/:id" element={<MagazineViewer />} />
              <Route path="/artist/:artistId" element={<ArtistProfile />} />
              <Route path="/artist/:artistId/magazine/:magazineId" element={<ArtistProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/poems" element={<Poems />} />              {/* NEW */}
              <Route path="/poem/:id" element={<PoemView />} />        {/* NEW */}
              <Route path="/write-poem" element={<WritePoem />} />     {/* NEW */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;