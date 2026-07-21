import { useParams } from "react-router-dom";
import useSWR from "swr";
import { supabase } from "../lib/supabase";
import SubjectCard from "../components/SubjectCard";

import EmptyState from "../components/EmptyState";
import { BookX } from "lucide-react";

const fetcher = async (sem: string) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, code, semester")
    .eq("semester", Number(sem))
    .order("name");
  if (error) throw error;
  return data;
};

export default function SemesterDashboard() {
  const { semNumber } = useParams<{ semNumber: string }>();
  const semester = Number(semNumber);
  
  const { data: subjects, isLoading: loading } = useSWR(
    (semester >= 3 && semester <= 8) ? semester.toString() : null,
    fetcher
  );


  return (
    <div>
      <div className="mb-10 pb-4 border-b border-border-color">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight">
          Semester {semester}
        </h2>
        <p className="text-text-muted mt-2 font-medium">Browse subjects and resources for this semester.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl border border-border-color"></div>
          ))}
        </div>
      ) : (subjects && subjects.length > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((sub, index) => (
            <div 
              key={sub.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <SubjectCard 
                id={sub.id} 
                name={sub.name} 
                code={sub.code} 
                semester={sub.semester} 
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<BookX className="w-12 h-12" />} 
          message="Subjects for this semester will appear here soon." 
        />
      )}
    </div>
  );
}
