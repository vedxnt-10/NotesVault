import { useEffect } from "react";
import { Sparkles, FileText, DownloadCloud, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Home() {
  useEffect(() => {
    const trackVisit = async () => {
      const hasVisited = sessionStorage.getItem("hasVisited");
      if (!hasVisited) {
        sessionStorage.setItem("hasVisited", "true");
        const { error } = await supabase.rpc("increment_visitor_count");
        if (error) {
          sessionStorage.removeItem("hasVisited");
        }
      }
    };
    trackVisit();
  }, []);

  return (
    <div className="flex flex-col items-center pt-12 md:pt-20 pb-16 text-center px-4 max-w-4xl mx-auto space-y-12">
      
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pastel-blue text-blue-900 text-sm font-extrabold shadow-sm transition-all duration-300 hover:scale-105">
        <Sparkles className="w-4 h-4" />
        <span className="tracking-widest">YOUR ACADEMIC ARSENAL</span>
      </div>

      <div className="space-y-6">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-text-main tracking-tight leading-[1.1]">
          Master <br />
          <span className="font-serif italic font-normal text-text-muted">The Syllabus.</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          The ultimate, clutter-free knowledge base for AI-DS students at BMSCE. 
          Find verified notes and past papers instantly. Select a semester from the sidebar to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-6 w-full pt-12 max-w-5xl mx-auto text-left">
        <div className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-10 bg-pastel-yellow rounded-[40px] transition-all duration-500 hover:-translate-y-2 hover:shadow-dribbble group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <div className="relative z-10">
            <div className="bg-white/60 text-yellow-900 p-4 rounded-3xl w-fit mb-8 shadow-sm backdrop-blur-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-yellow-950 text-3xl tracking-tight mb-3">Verified Notes</h3>
            <p className="text-yellow-900/80 font-semibold text-lg leading-relaxed max-w-sm">Curated by top students and cross-referenced with the latest VTU syllabus for absolute accuracy.</p>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center p-8 bg-pastel-pink rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-dribbble group relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-5 mb-3">
            <div className="bg-white/60 text-pink-900 p-3.5 rounded-2xl backdrop-blur-sm">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-pink-950 text-2xl tracking-tight">PYQ Archive</h3>
          </div>
          <p className="text-pink-900/80 font-semibold text-base relative z-10">Comprehensive collection of previous year question papers to help you master exam patterns.</p>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center p-8 bg-pastel-orange rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-dribbble group relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-3">
              <div className="bg-white/60 text-orange-900 p-3.5 rounded-2xl backdrop-blur-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-orange-950 text-2xl tracking-tight">Always Free</h3>
            </div>
            <p className="text-orange-900/80 font-semibold text-base">Zero paywalls. No login required. Lightning fast downloads powered by edge functions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
