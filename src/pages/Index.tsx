import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, Feather, Music, FileText, Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// TODO: replace these two with your real store links
const APP_STORE_URL = "https://apps.apple.com/";
const PLAY_STORE_URL = "https://play.google.com/store";

const LOGO = "/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png";

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
  </svg>
);

const StoreButton = ({
  href,
  icon,
  small,
  big,
}: {
  href: string;
  icon: React.ReactNode;
  small: string;
  big: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 rounded-xl bg-black text-white px-5 py-3 w-full sm:w-auto sm:min-w-[210px] justify-center sm:justify-start border border-white/20 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200"
  >
    {icon}
    <span className="flex flex-col text-left leading-tight">
      <span className="text-[11px] opacity-80">{small}</span>
      <span className="text-lg font-semibold">{big}</span>
    </span>
  </a>
);

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const features = [
    { icon: BookOpen, label: "Magazines" },
    { icon: Feather, label: "Poetry" },
    { icon: Music, label: "Songs" },
    { icon: FileText, label: "Blogs" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <div className="relative">
                <img
                  src={LOGO}
                  alt="Be Inspired Logo"
                  className="h-8 w-8 animate-float cursor-pointer"
                  onClick={() => handleNavigation('/')}
                />
                <Sparkles className="h-3 w-3 text-primary/60 absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
              <h1
                className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer"
                onClick={() => handleNavigation('/')}
              >
                Be Inspired
              </h1>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => navigate('/about')} className="btn-modern text-sm px-3">About</Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/contact')} className="btn-modern text-sm px-3">Contact</Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="btn-modern text-sm px-3">Dashboard</Button>
              <Button onClick={() => navigate('/auth')} className="btn-modern bg-gradient-to-r from-primary to-primary/80 text-sm px-3">Sign Up</Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-border/50 space-y-2">
              <Button variant="ghost" size="sm" onClick={() => handleNavigation('/about')} className="w-full justify-start text-sm">About</Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation('/contact')} className="w-full justify-start text-sm">Contact</Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation('/dashboard')} className="w-full justify-start text-sm">Dashboard</Button>
              <Button onClick={() => handleNavigation('/auth')} className="w-full btn-modern bg-gradient-to-r from-primary to-primary/80 text-sm mt-2">Sign Up</Button>
            </div>
          )}
        </div>
      </header>

      {/* Main message */}
      <main className="flex-1 flex items-center relative overflow-hidden px-4 py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-60 pointer-events-none" />
        <div className="container mx-auto text-center relative">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <img src={LOGO} alt="Be Inspired Logo" className="h-20 w-20 sm:h-24 sm:w-24 mx-auto animate-float" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              Sorry, we're updating our website
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Please visit the app to access magazines, poetry, songs and blogs.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <StoreButton
                href={APP_STORE_URL}
                icon={<AppleIcon />}
                small="Download on the"
                big="App Store"
              />
              <StoreButton
                href={PLAY_STORE_URL}
                icon={<PlayIcon />}
                small="GET IT ON"
                big="Google Play"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <img src={LOGO} alt="Be Inspired Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-base sm:text-lg font-semibold text-primary">Be Inspired</span>
          </div>
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4">
            <button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">About</button>
            <button onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Contact</button>
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Dashboard</button>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Be Inspired. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;