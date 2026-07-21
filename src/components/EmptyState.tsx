import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  message: string;
}

export default function EmptyState({ icon, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-accent/30 rounded-[24px] border border-dashed border-border-color/60 m-2">
      <div className="text-text-muted/40 mb-4 p-4 bg-card rounded-full shadow-sm">
        {icon}
      </div>
      <p className="text-text-muted font-medium text-sm max-w-xs">
        {message}
      </p>
    </div>
  );
}
