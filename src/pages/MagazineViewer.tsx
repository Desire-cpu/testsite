import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, BookOpen } from "lucide-react";
import { useMagazine } from "@/hooks/useMagazine";
import FlipBookViewer from "@/components/FlipBookViewer";

const MagazineViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { magazine, loading } = useMagazine(id);

  const handleCloseViewer = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading magazine...</p>
        </div>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Magazine Not Found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            The magazine could not be found or failed to load.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!magazine.file_url) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No File Available</h2>
          <p className="text-muted-foreground text-sm mb-4">
            This magazine doesn't have a file available for viewing.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <FlipBookViewer
      fileUrl={magazine.file_url}
      onClose={handleCloseViewer}
      onLoadSuccess={({ numPages }) => {
        console.log(`Magazine loaded: ${magazine.title} with ${numPages} pages`);
      }}
      onLoadError={(error) => {
        console.error('Magazine load error:', error);
      }}
    />
  );
};

export default MagazineViewer;