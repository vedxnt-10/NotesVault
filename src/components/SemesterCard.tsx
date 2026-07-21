import { Link } from "react-router-dom";

interface Props {
  semester: number;
}

export default function SemesterCard({ semester }: Props) {
  return (
    <Link 
      to={`/semester/${semester}`}
      className="group flex flex-col justify-center items-center bg-card rounded-[32px] border border-border-color/50 p-8 transition-all duration-400 hover:-translate-y-2 hover:shadow-dribbble hover:border-border-color min-h-[160px] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-inverse group-hover:text-body transition-colors duration-400 shadow-sm">
          <span className="text-2xl font-extrabold">{semester}</span>
        </div>
        <div className="text-text-main font-bold tracking-tight text-lg group-hover:text-inverse transition-colors">
          Semester {semester}
        </div>
      </div>
    </Link>
  );
}
