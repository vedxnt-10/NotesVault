import { Link } from "react-router-dom";


interface Props {
  id: string;
  semester: number;
  name: string;
  code?: string | null;
}

export default function SubjectCard({ id, semester, name, code }: Props) {
  return (
    <Link 
      to={`/semester/${semester}/subject/${id}`}
      className="group flex flex-col justify-center bg-card rounded-[20px] p-5 transition-all duration-400 shadow-sm hover:shadow-dribbble hover:-translate-y-1 border border-border-color/50 overflow-hidden relative"
    >
      {/* Decorative top-right circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <h3 className="text-base font-extrabold text-text-main line-clamp-2 transition-colors relative z-10 leading-tight">
        {name}
      </h3>
      
      <div className="mt-4 flex items-center justify-between relative z-10">
        {code ? (
          <span className="text-xs font-bold text-text-muted bg-accent px-3 py-1.5 rounded-full uppercase tracking-wider">
            {code}
          </span>
        ) : (
          <span />
        )}
        
        <div className="w-6 h-6 rounded-full bg-inverse text-body flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
