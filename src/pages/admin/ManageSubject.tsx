import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import AdminUploadZone from "../../components/AdminUploadZone";
import { ChevronLeft } from "lucide-react";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-fallback-123";

interface Subject {
  id: string;
  name: string;
  code: string | null;
  semester: number;
}

interface Document {
  id: string;
  title: string;
  file_path: string;
  doc_type: "note" | "pyq";
  unit_number: number | null;
}

export default function ManageSubject() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate(`/${ADMIN_PATH}`);
      } else {
        fetchData();
      }
    };
    checkAuth();
  }, [subjectId, navigate]);

  const fetchData = async () => {
    setLoading(true);
    
    if (!subjectId) return;

    const [subjRes, docsRes] = await Promise.all([
      supabase.from("subjects").select("*").eq("id", subjectId).single(),
      supabase.from("documents").select("*").eq("subject_id", subjectId)
    ]);

    if (subjRes.data) setSubject(subjRes.data);
    if (docsRes.data) setDocuments(docsRes.data);
    
    setLoading(false);
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-card rounded-xl"></div>;
  }

  if (!subject) {
    return <div className="text-center py-12 text-text-muted">Subject not found.</div>;
  }

  const pyqs = documents.filter(d => d.doc_type === "pyq");

  return (
    <div>
      <div className="mb-6">
        <Link 
          to={`/${ADMIN_PATH}/dashboard`}
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-inverse transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-card border border-border-color rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent rounded-bl-full -mr-20 -mt-20 opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-text-main tracking-tight">{subject.name}</h2>
          <div className="flex items-center gap-3 mt-3">
            <span className="bg-inverse/10 text-inverse px-3 py-1 rounded-lg text-sm font-bold">
              Semester {subject.semester}
            </span>
            {subject.code && (
              <span className="bg-accent text-text-muted px-3 py-1 rounded-lg text-sm font-bold">
                {subject.code}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-text-main">Units (Notes)</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(unit => {
              // Get docs for this unit
              const docs = documents.filter(d => d.doc_type === "note" && d.unit_number === unit);
              return (
                <div key={unit} className="space-y-3">
                  {docs.map(doc => (
                    <AdminUploadZone 
                      key={doc.id}
                      subjectId={subject.id}
                      subjectCode={subject.code || `SUBJ${subject.id.slice(0,4)}`}
                      semester={subject.semester}
                      docType="note"
                      unitNumber={unit}
                      existingDoc={doc}
                      onSuccess={fetchData}
                    />
                  ))}
                  <AdminUploadZone 
                    subjectId={subject.id}
                    subjectCode={subject.code || `SUBJ${subject.id.slice(0,4)}`}
                    semester={subject.semester}
                    docType="note"
                    unitNumber={unit}
                    onSuccess={fetchData}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-text-main">Previous Year Questions</h3>
          <div className="space-y-4">
            {pyqs.map(doc => (
              <AdminUploadZone 
                key={doc.id}
                subjectId={subject.id}
                subjectCode={subject.code || `SUBJ${subject.id.slice(0,4)}`}
                semester={subject.semester}
                docType="pyq"
                unitNumber={null}
                existingDoc={doc}
                onSuccess={fetchData}
              />
            ))}
            {/* Show 3 empty slots to make it clear multiple can be uploaded */}
            {[1, 2, 3].map((i) => (
              <AdminUploadZone 
                key={`empty-pyq-${i}`}
                subjectId={subject.id}
                subjectCode={subject.code || `SUBJ${subject.id.slice(0,4)}`}
                semester={subject.semester}
                docType="pyq"
                unitNumber={null}
                onSuccess={fetchData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
