import React, { useState, useEffect, useRef } from "react";
import { Document, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface FlipBookViewerProps {
  fileUrl: string;
  onClose?: () => void;
}

const FlipBookViewer: React.FC<FlipBookViewerProps> = ({ fileUrl, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBookRef = useRef<any>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Responsive sizing
  const isMobile = windowSize.width < 768;
  const bookWidth = isMobile ? Math.min(windowSize.width - 32, 360) : Math.min(windowSize.width * 0.6, 520);
  const bookHeight = isMobile ? Math.min(windowSize.height * 0.65, 480) : Math.min(windowSize.height * 0.75, 720);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render PDF to images
  const handleLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(true);
    const images: string[] = [];
    const pdf = await pdfjs.getDocument(fileUrl).promise;
    for (let i = 1; i <= numPages; i++) {
      const canvas = document.createElement("canvas");
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d")!;
      await page.render({ canvasContext: context, viewport }).promise;
      images.push(canvas.toDataURL('image/jpeg', 0.9));
      setPageImages([...images]); // update incrementally for feedback
    }
    setLoading(false);
  };

  const handleFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  // Touch handlers for mobile
  useEffect(() => {
    if (windowSize.width >= 768 || loading || !flipBookRef.current) return;
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentPage > 0) {
          flipBookRef.current?.flipPrev();
        } else if (deltaX < 0 && currentPage < pageImages.length - 1) {
          flipBookRef.current?.flipNext();
        }
      }
    };
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [windowSize.width, loading, currentPage, pageImages.length]);

  return (
    <div className="fbv-outer">
      {/* Inline styles for all flipbook elements */}
      <style>
        {`
        .fbv-outer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg,#1e293b 0%,#222c3a 60%,#1e293b 100%);
          min-height: 100vh;
          overflow: auto;
        }
        .fbv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: rgba(0,0,0,0.15);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
        }
        .fbv-title {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
        }
        .fbv-pager {
          color: #e2e8f0;
          font-size: 0.95rem;
        }
        .fbv-close-btn {
          padding: 0.5em 1.2em;
          background: #ef4444cc;
          color: #fff;
          border-radius: 0.5em;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fbv-close-btn:hover {
          background: #ef4444;
        }
        .fbv-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .fbv-flipbook-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .fbv-flipbook {
          margin: 0 auto;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          border-radius: 1em;
          background: #fff;
          max-width: 100vw;
          max-height: 100vh;
          overflow: visible;
        }
        .fbv-flipbook-page {
          background: #fff;
          width: 100%;
          height: 100%;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .fbv-flipbook-page img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #fff;
          display: block;
          border-radius: 0.5em;
        }
        .fbv-nav {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 2rem;
        }
        .fbv-nav-btn {
          width: 3em;
          height: 3em;
          border-radius: 50%;
          background: rgba(10,10,10,0.45);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4em;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fbv-nav-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .fbv-nav-btn:not(:disabled):hover {
          background: rgba(10,10,10,0.7);
        }
        .fbv-instructions {
          position: absolute;
          bottom: -2.2rem;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          opacity: 0.7;
          font-size: 0.95em;
          text-align: center;
        }
        .fbv-footer {
          padding: 1rem 1.2rem;
          background: rgba(0,0,0,0.13);
          border-top: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fbv-progress-bar-bg {
          width: 12em;
          height: 0.5em;
          background: rgba(255,255,255,0.13);
          border-radius: 1em;
          overflow: hidden;
          margin-right: 0.6em;
        }
        .fbv-progress-bar {
          height: 100%;
          background: rgba(255,255,255,0.8);
          transition: width 0.3s;
        }
        .fbv-progress-text {
          color: #fff;
          font-size: 0.95em;
        }
        @media(max-width: 767px) {
          .fbv-main { padding: 0.5rem; }
          .fbv-flipbook { box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
          .fbv-footer { padding: 0.6rem; }
        }
        `}
      </style>

      {/* Header */}
      <div className="fbv-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1.3em" }}>
          <span className="fbv-title">Magazine Viewer</span>
          {numPages && (
            <span className="fbv-pager">
              Page {currentPage + 1} of {pageImages.length}
            </span>
          )}
        </div>
        {onClose && (
          <button className="fbv-close-btn" onClick={onClose}>Close</button>
        )}
      </div>

      {/* Main */}
      <div className="fbv-main">
        <Document
          file={fileUrl}
          onLoadSuccess={handleLoadSuccess}
          loading={
            <div style={{ color: "#fff", textAlign: "center", marginTop: "3em" }}>
              <div className="animate-spin" style={{
                borderRadius: "50%",
                width: "3em",
                height: "3em",
                borderBottom: "0.3em solid #fff",
                margin: "0 auto"
              }}></div>
              <div style={{ marginTop: "1em" }}>Loading PDF...</div>
            </div>
          }
        >
          {loading ? (
            <div style={{ color: "#fff", textAlign: "center", marginTop: "2em" }}>
              Rendering pages...
            </div>
          ) : pageImages.length > 0 ? (
            <div className="fbv-flipbook-container" style={{ width: bookWidth, height: bookHeight }}>
              <HTMLFlipBook
                ref={flipBookRef}
                width={bookWidth}
                height={bookHeight}
                minWidth={250}
                maxWidth={600}
                minHeight={300}
                maxHeight={800}
                showCover={true}
                mobileScrollSupport={true}
                drawShadow={true}
                flippingTime={600}
                useMouseEvents={true}
                usePortrait={true}
                autoSize={true}
                maxShadowOpacity={0.3}
                showPageCorners={true}
                disableFlipByClick={false}
                onFlip={handleFlip}
                className="fbv-flipbook"
              >
                {pageImages.map((src, index) => (
                  <div 
                    key={index}
                    className="fbv-flipbook-page"
                  >
                    <img 
                      src={src} 
                      alt={`Page ${index + 1}`}
                      draggable={false}
                    />
                  </div>
                ))}
              </HTMLFlipBook>

              {/* Navigation controls for mobile */}
              {isMobile && (
                <div className="fbv-nav">
                  <button
                    className="fbv-nav-btn"
                    onClick={() => flipBookRef.current?.flipPrev()}
                    disabled={currentPage === 0}
                  >
                    &#8592;
                  </button>
                  <button
                    className="fbv-nav-btn"
                    onClick={() => flipBookRef.current?.flipNext()}
                    disabled={currentPage >= pageImages.length - 1}
                  >
                    &#8594;
                  </button>
                </div>
              )}

              <div className="fbv-instructions">
                {isMobile ? "Swipe or use arrows to navigate" : "Click page edges to flip"}
              </div>
            </div>
          ) : (
            <div style={{ color: "#fff", textAlign: "center", marginTop: "2em" }}>
              No pages found
            </div>
          )}
        </Document>
      </div>

      {/* Footer */}
      {!loading && pageImages.length > 0 && (
        <div className="fbv-footer">
          <div className="fbv-progress-bar-bg">
            <div 
              className="fbv-progress-bar"
              style={{ width: `${((currentPage + 1) / pageImages.length) * 100}%` }}
            ></div>
          </div>
          <span className="fbv-progress-text">
            {currentPage + 1} / {pageImages.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default FlipBookViewer;