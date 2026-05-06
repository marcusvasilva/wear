import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <ol className="flex items-center gap-1.5 text-sm whitespace-nowrap">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-text-muted hover:text-text transition-colors"
          >
            <Home size={14} />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              <ChevronRight size={14} className="text-text-muted" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "text-text font-medium" : "text-text-muted"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
