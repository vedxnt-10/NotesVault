import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  unitNumber: number;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function UnitAccordion({ unitNumber, count, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-4 transition-all duration-300 rounded-[24px] border ${isOpen ? 'border-border-color shadow-sm bg-card' : 'border-border-color/50 bg-card hover:border-inverse/20 shadow-sm hover:shadow-dribbble hover:-translate-y-0.5'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-6 rounded-[24px] group focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className={`font-extrabold text-lg transition-colors ${isOpen ? 'text-inverse' : 'text-text-main group-hover:text-inverse'}`}>
            Unit {unitNumber}
          </span>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isOpen ? 'bg-inverse text-body' : 'bg-accent text-text-muted group-hover:bg-inverse/10 group-hover:text-inverse'}`}>
            {count} file{count !== 1 ? "s" : ""}
          </span>
        </div>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-inverse text-body' : 'text-text-muted bg-accent group-hover:bg-inverse group-hover:text-body'}`}>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          />
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6 pt-2 border-t border-border-color/50">
          {children}
        </div>
      </div>
    </div>
  );
}
