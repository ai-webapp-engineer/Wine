import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-4 w-4 border",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
} as const;

type SpinnerProps = {
  className?: string;
  size?: keyof typeof sizes;
  label?: string;
};

export function Spinner({ className, size = "md", label = "読み込み中" }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center justify-center", className)}>
      <span
        className={cn(
          "animate-spin rounded-full border-stone-200 border-t-wine-700",
          sizes[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function LoadingCenter({
  label = "読み込み中...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16", className)}>
      <Spinner size="lg" label={label} />
      <p className="text-sm text-stone-500">{label}</p>
    </div>
  );
}
