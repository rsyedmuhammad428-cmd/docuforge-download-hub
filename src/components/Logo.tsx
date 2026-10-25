import { cn } from "@/lib/utils";

/** DocuForge logo mark: a document sheet with a folded corner and a gold forge spark. */
export function LogoMark({ className }: { className?: string | undefined }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M10 7.5h8.2L23 12.3V24a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 9 24V9a1.5 1.5 0 0 1 1-1.5Z"
        className="fill-card"
      />
      <path d="M18.2 7.5 23 12.3h-4.8V7.5Z" className="fill-gold" />
      <path
        d="M12 16.5h8M12 19.5h8M12 22.5h5"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-muted-foreground"
      />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string | undefined; markClassName?: string | undefined }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-xl font-semibold tracking-tight">DocuForge</span>
    </span>
  );
}
