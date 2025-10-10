
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface PDFControlsProps {
  scale: number;
  pageNumber: number;
  numPages: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const PDFControls: React.FC<PDFControlsProps> = ({
  scale,
  pageNumber,
  numPages,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPrevPage,
  onNextPage
}) => {
  return (
    <>
      {/* Zoom Controls in Header */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onResetZoom}>
          {Math.round(scale * 100)}%
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Page {pageNumber} of {numPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={pageNumber >= numPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </>
  );
};

export default PDFControls;
