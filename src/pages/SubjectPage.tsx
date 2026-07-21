import { useParams } from "react-router-dom";
import useSWR from "swr";
import { supabase } from "../lib/supabase";

import UnitAccordion from "../components/UnitAccordion";
import PDFRow from "../components/PDFRow";
import EmptyState from "../components/EmptyState";
import { FileQuestion, FolderOpen } from "lucide-react";

const fetcher = async (subjectId: string) => {
  const [subjRes, docsRes] = await Promise.all([
    supabase.from("subjects").select("*").eq("id", subjectId).single(),
    supabase.from("documents").select("*").eq("subject_id", subjectId).order("created_at", { ascending: false })
  ]);
  if (subjRes.error) throw subjRes.error;
  return { subject: subjRes.data, documents: docsRes.data || [] };
};

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  const { data, isLoading: loading } = useSWR(
    subjectId ? subjectId : null,
    fetcher
  );

  const subject = data?.subject;
  const documents = data?.documents || [];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="h-10 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!subject) {
    return <div className="text-center py-12 text-text-muted">Subject not found.</div>;
  }

  const notes = documents.filter(d => d.doc_type === "note");
  const pyqs = documents.filter(d => d.doc_type === "pyq");

  return (
    <div className="animate-fade-in">
      <div className="mb-12 bg-card p-8 sm:p-10 rounded-[32px] border border-border-color/50 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent to-transparent rounded-bl-full -mr-16 -mt-16 opacity-60" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-main tracking-tight leading-tight">
            {subject.name}
          </h2>
          {subject.code && (
            <p className="text-text-muted mt-3 font-bold text-lg bg-accent inline-block px-4 py-1.5 rounded-full">{subject.code}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Notes Section */}
        <div>
          <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-inverse" />
            Notes
          </h3>
          
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(unitNum => {
              const unitNotes = notes.filter(n => n.unit_number === unitNum);
              return (
                <UnitAccordion key={unitNum} unitNumber={unitNum} count={unitNotes.length} defaultOpen={unitNum === 1 && unitNotes.length > 0}>
                  {unitNotes.length > 0 ? (
                    <div className="flex flex-col gap-1 py-1">
                      {unitNotes.map(note => (
                        <PDFRow
                          key={note.id}
                          id={note.id}
                          title={note.title}
                          filePath={note.file_path}
                          createdAt={note.created_at}
                          docType="note"
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      icon={<FolderOpen className="w-8 h-8" />} 
                      message="Not uploaded yet, check back soon." 
                    />
                  )}
                </UnitAccordion>
              );
            })}
          </div>
        </div>

        {/* PYQs Section */}
        <div>
          <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-inverse" />
            Previous Year Question Papers
          </h3>
          
          <div className="bg-card rounded-[24px] border border-border-color/50 p-2 shadow-sm">
            {pyqs.length > 0 ? (
              <div className="flex flex-col gap-1 px-3 py-2">
                {pyqs.map(pyq => (
                  <PDFRow
                    key={pyq.id}
                    id={pyq.id}
                    title={pyq.title}
                    filePath={pyq.file_path}
                    createdAt={pyq.created_at}
                    docType="pyq"
                  />
                ))}
              </div>
            ) : (
              <div className="py-4">
                <EmptyState 
                  icon={<FileQuestion className="w-8 h-8" />} 
                  message="No previous year papers uploaded yet." 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
