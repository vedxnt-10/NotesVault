import React, { useState, useRef } from "react";
import { UploadCloud, Trash2, FileText, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Props {
  subjectId: string;
  subjectCode: string;
  semester: number;
  docType: "note" | "pyq";
  unitNumber: number | null;
  existingDoc?: { id: string; title: string; file_path: string } | null;
  onSuccess: () => void;
}

export default function AdminUploadZone({ subjectId, subjectCode, semester, docType, unitNumber, existingDoc, onSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    
    if (!customTitle.trim()) {
      setError("Please enter a display name first.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const pathPrefix = docType === "note" 
        ? `sem${semester}/${subjectCode}/unit${unitNumber}` 
        : `sem${semester}/${subjectCode}/pyq`;
      
      const filePath = `${pathPrefix}/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, file, { contentType: "application/pdf" });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("documents").insert({
        subject_id: subjectId,
        doc_type: docType,
        unit_number: unitNumber,
        title: customTitle.trim(),
        file_path: filePath,
        file_size_bytes: file.size
      });

      if (dbError) throw dbError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setCustomTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!existingDoc || !window.confirm(`Delete ${existingDoc.title}?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("pdfs")
        .remove([existingDoc.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from("documents")
        .delete()
        .eq("id", existingDoc.id);

      if (dbError) throw dbError;

      onSuccess();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="border border-border-color rounded-2xl p-5 bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-text-main flex items-center gap-2">
          {docType === "note" ? (
            <span className="bg-inverse/10 text-inverse px-3 py-1 rounded-lg text-sm">Unit {unitNumber}</span>
          ) : (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm">PYQ</span>
          )}
        </h4>
      </div>

      {error && <div className="text-red-500 text-sm font-medium mb-3 bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

      {existingDoc ? (
        <div className="flex items-center justify-between bg-body border border-border-color p-4 rounded-xl group hover:border-inverse/20 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden mr-2">
            <div className="bg-inverse/10 text-inverse p-2 rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-text-main truncate group-hover:text-inverse transition-colors" title={existingDoc.title}>{existingDoc.title}</span>
          </div>
          <button 
            onClick={handleDelete}
            className="text-text-muted hover:text-inverse p-2 hover:bg-red-500 rounded-xl transition-all shadow-sm"
            title="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Display Name *</label>
            <input 
              type="text" 
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder={docType === "note" ? "e.g. Introduction to ML" : "e.g. 2023 End Semester Paper"}
              className="w-full bg-body border border-border-color/50 rounded-xl px-4 py-3 text-sm font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-inverse/20 transition-all shadow-sm"
            />
          </div>
          <div 
            className="border-2 border-dashed border-border-color hover:border-inverse/20 bg-body hover:bg-accent rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
          <input 
            type="file" 
            accept="application/pdf"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleUpload}
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-inverse animate-spin mb-3" />
              <span className="text-sm text-inverse font-bold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-card p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 group-hover:bg-inverse/10 transition-transform">
                <UploadCloud className="w-6 h-6 text-text-muted group-hover:text-inverse transition-colors" />
              </div>
              <span className="text-sm font-bold text-text-muted group-hover:text-inverse transition-colors">
                Click to browse PDF
              </span>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}
