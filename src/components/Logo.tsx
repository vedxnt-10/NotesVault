

export default function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Back Paper */}
      <path d="M 47 18 H 26 A 6 6 0 0 0 20 24 V 66" />

      {/* Front Paper (with gap for paperclip) */}
      <path d="M 49 28 H 36 A 6 6 0 0 0 30 34 V 84 A 6 6 0 0 0 36 90 H 74 A 6 6 0 0 0 80 84 V 34 A 6 6 0 0 0 74 28 H 65" />

      {/* Document Lines */}
      <path d="M 44 48 H 66" />
      <path d="M 44 62 H 66" />
      <path d="M 44 76 H 66" />

      {/* Paperclip */}
      <path d="M 55 42 V 22 A 2 2 0 0 1 59 22 V 46 A 4 4 0 0 1 51 46 V 18 A 6 6 0 0 1 63 18 V 50" />
    </svg>
  );
}
