import { useEffect } from "react";
import { X, ExternalLink, Download } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export default function PDFViewerModal({ isOpen, onClose, pdfUrl, title }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = title.endsWith(".pdf") ? title : `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      // Fallback to simple download via link if fetch fails (e.g. CORS)
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = title;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col bg-card rounded-2xl shadow-premium overflow-hidden ring-1 ring-border-color/50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-color bg-body/80 backdrop-blur-md">
          <h3 className="font-bold text-text-main text-lg truncate pr-4">{title}</h3>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="p-2 text-text-muted hover:text-inverse hover:bg-inverse/10 rounded-xl transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-text-muted hover:text-inverse hover:bg-inverse/10 rounded-xl transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <div className="w-px h-6 bg-border-color mx-1" />
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full bg-accent relative">
          <iframe 
            src={`${pdfUrl}#toolbar=0`} 
            className="w-full h-full border-0 absolute inset-0"
            title={`Preview of ${title}`}
          />
        </div>
      </div>
    </div>
  );
}
