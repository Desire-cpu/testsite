
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Import CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl: string;
  pageNumber?: number;
  scale?: number;
  onLoadSuccess?: ({ numPages }: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  onLoadSuccess,
  onLoadError
}) => {
  const [hasError, setHasError] = React.useState(false);

  console.log('PDFViewer - Rendering with fileUrl:', fileUrl);

  // Create default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleDocumentLoad = React.useCallback((e: any) => {
    console.log('✅ PDF document loaded successfully');
    setHasError(false);
    if (onLoadSuccess) {
      onLoadSuccess({ numPages: e.doc.numPages });
    }
  }, [onLoadSuccess]);

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No PDF file available.</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-destructive text-center mb-2">
          Failed to load PDF document
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          The PDF could not be displayed. Try opening it in a new tab.
        </p>
        <Button 
          variant="outline"
          onClick={() => window.open(fileUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white" style={{ minHeight: '600px' }}>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          onDocumentLoad={handleDocumentLoad}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
