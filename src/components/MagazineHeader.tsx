
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MagazineHeaderProps {
  onBackToHome: () => void;
  children?: React.ReactNode;
}

const MagazineHeader: React.FC<MagazineHeaderProps> = ({ onBackToHome, children }) => {
  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" alt="Be Inspired Logo" className="h-6 w-6" />
              <h1 className="text-xl font-bold text-primary">Be Inspired</h1>
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </header>
  );
};

export default MagazineHeader;
