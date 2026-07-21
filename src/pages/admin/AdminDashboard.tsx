import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Plus, Trash2, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-fallback-123";

interface Subject {
  id: string;
  name: string;
  code: string | null;
  semester: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSem, setActiveSem] = useState(1);
  const [loading, setLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  
  const [newSubName, setNewSubName] = useState("");
  const [newSubCode, setNewSubCode] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate(`/${ADMIN_PATH}`);
      } else {
        fetchSubjects();
        fetchVisitors();
      }
    };
    checkAuth();
  }, [activeSem, navigate]);

  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, code, semester")
      .eq("semester", activeSem)
      .order("created_at");

    if (error) console.error(error);
    if (data) setSubjects(data);
    setLoading(false);
  };

  const fetchVisitors = async () => {
    const { data } = await supabase.from("site_stats").select("total_visitors").eq("id", 1).single();
    if (data) {
      setVisitorCount(data.total_visitors);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    setAdding(true);

    const { data: dept, error: deptError } = await supabase.from("departments").select("id").limit(1).single();
    if (!dept) {
      alert("No department found in DB. Error: " + (deptError?.message || "Unknown"));
      setAdding(false);
      return;
    }

    const { error } = await supabase.from("subjects").insert({
      department_id: dept.id,
      semester: activeSem,
      name: newSubName,
      code: newSubCode || null
    });

    if (error) {
      alert("Failed to add subject: " + error.message);
    } else {
      setNewSubName("");
      setNewSubCode("");
      fetchSubjects();
    }
    setAdding(false);
  };

  const handleDeleteSubject = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete ${name}? This will delete all its notes and PYQs too.`)) {
      return;
    }
    // Fetch all docs to delete their files from storage first
    const { data: docs } = await supabase.from("documents").select("file_path").eq("subject_id", id);
    if (docs && docs.length > 0) {
      const paths = docs.map(d => d.file_path);
      await supabase.storage.from("pdfs").remove(paths);
    }

    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) {
      alert("Failed to delete subject: " + error.message);
    } else {
      fetchSubjects();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(`/${ADMIN_PATH}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-card p-6 rounded-2xl border border-border-color shadow-sm transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main tracking-tight">Admin Dashboard</h2>
          <p className="text-sm font-medium text-text-muted mt-1">Manage subjects and course materials.</p>
        </div>
        <div className="flex items-center gap-4">
          {visitorCount !== null && (
            <div className="flex items-center bg-accent text-text-main px-4 py-2 rounded-xl text-sm font-bold shadow-sm" title="Total Unique Sessions">
              <Users className="w-4 h-4 mr-2 text-text-muted" />
              {visitorCount.toLocaleString()} Visitors
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm w-fit">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
          <button
            key={sem}
            onClick={() => setActiveSem(sem)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${activeSem === sem ? "bg-inverse text-text-inverse shadow-md -translate-y-0.5" : "bg-card border border-border-color text-text-main hover:bg-accent hover:border-border-color shadow-sm hover:shadow-soft"}`}
          >
            Semester {sem}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border-color rounded-2xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
        <h3 className="text-lg font-bold mb-6 text-text-main relative z-10 flex items-center gap-2">
          <Plus className="w-5 h-5 text-inverse" />
          Add Subject <span className="text-text-muted font-semibold text-sm">(Sem {activeSem})</span>
        </h3>
        <form onSubmit={handleAddSubject} className="flex flex-col lg:flex-row gap-5 items-end relative z-10">
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Subject Name*</label>
            <input 
              value={newSubName} 
              onChange={e => setNewSubName(e.target.value)} 
              required
              className="w-full px-4 py-3 bg-body border border-border-color rounded-xl text-sm font-medium focus:outline-none focus:border-inverse focus:bg-card focus:ring-4 focus:ring-inverse/10 transition-all placeholder:text-text-muted/50 text-text-main"
              placeholder="e.g. Machine Learning" 
            />
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Subject Code (optional)</label>
            <input 
              value={newSubCode} 
              onChange={e => setNewSubCode(e.target.value)} 
              className="w-full px-4 py-3 bg-body border border-border-color rounded-xl text-sm font-medium focus:outline-none focus:border-inverse focus:bg-card focus:ring-4 focus:ring-inverse/10 transition-all placeholder:text-text-muted/50 text-text-main"
              placeholder="e.g. AI301" 
            />
          </div>
          <button 
            type="submit" 
            disabled={adding}
            className="w-full lg:w-auto bg-inverse text-body px-8 py-3 rounded-xl text-sm font-bold hover:bg-inverse/80 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all whitespace-nowrap"
          >
            {adding ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse h-20 bg-card rounded-2xl border border-border-color shadow-sm"></div>
        ) : subjects.length > 0 ? (
          subjects.map(sub => (
            <Link 
              key={sub.id} 
              to={`/${ADMIN_PATH}/dashboard/subject/${sub.id}`}
              className="group flex flex-col sm:flex-row justify-between sm:items-center bg-card p-5 rounded-2xl border border-border-color hover:border-inverse/20 hover:shadow-soft transition-all duration-300 gap-4"
            >
              <div>
                <span className="font-bold text-text-main group-hover:text-inverse transition-colors">{sub.name}</span>
                {sub.code && <span className="text-sm font-medium text-text-muted ml-2">({sub.code})</span>}
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t border-border-color/50 sm:border-0 pt-3 sm:pt-0">
                <span className="text-inverse text-sm font-bold bg-accent px-4 py-2 rounded-xl group-hover:bg-inverse/10 transition-colors">Manage files →</span>
                <button
                  onClick={(e) => handleDeleteSubject(e, sub.id, sub.name)}
                  className="text-text-muted hover:text-white p-2 hover:bg-red-500 rounded-xl transition-all shadow-sm"
                  title="Delete subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 px-6 text-text-muted border-2 border-dashed border-border-color rounded-2xl bg-card flex flex-col items-center justify-center gap-3 transition-colors duration-300">
            <div className="bg-accent p-4 rounded-full">
              <Plus className="w-8 h-8 text-text-muted/50" />
            </div>
            <p className="font-medium">No subjects added yet for Semester {activeSem}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
