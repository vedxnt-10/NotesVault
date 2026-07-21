import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import React from "react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center text-sm mb-8 flex-wrap gap-y-2 bg-card/50 backdrop-blur-sm p-3 rounded-xl border border-border-color shadow-sm w-fit">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={index}>
            {crumb.href && !isLast ? (
              <Link to={crumb.href} className="text-text-main font-medium hover:text-inverse transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text-muted font-medium cursor-default">
                {crumb.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-4 h-4 mx-2 text-text-muted/40 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
