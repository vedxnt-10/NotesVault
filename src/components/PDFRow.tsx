import { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";
import PDFViewerModal from "./PDFViewerModal";

interface Props {
  id: string;
  title: string;
  filePath: string;
  createdAt: string;
  docType: "note" | "pyq";
}

export default function PDFRow({ title, filePath }: Props) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  


  const getUrl = () => {
    const { data } = supabase.storage.from("pdfs").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDownload = async () => {
    const url = getUrl();
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = title.endsWith(".pdf") ? title : `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border-color/30 last:border-0 gap-3 hover:bg-accent px-3 -mx-3 rounded-2xl transition-all duration-200">
      <div className="flex items-start sm:items-center gap-4 overflow-hidden">
        <div className="bg-card text-inverse border border-border-color/50 p-2.5 rounded-[16px] flex-shrink-0 group-hover:shadow-sm transition-all">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text-main group-hover:text-inverse truncate transition-colors" title={title}>
            {title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="inline-flex items-center justify-center text-sm font-bold border border-border-color/50 text-text-main bg-card hover:bg-inverse hover:text-body rounded-full px-5 py-2 transition-all shadow-sm"
          aria-label={`Preview ${title}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center text-sm font-bold bg-inverse text-body hover:bg-inverse/80 hover:shadow-dribbble hover:-translate-y-0.5 rounded-full px-5 py-2 transition-all shadow-sm"
          aria-label={`Download ${title}`}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>

      <PDFViewerModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={getUrl()}
        title={title}
      />
    </div>
  );
}
