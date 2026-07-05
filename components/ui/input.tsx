import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none ring-wine-700 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
