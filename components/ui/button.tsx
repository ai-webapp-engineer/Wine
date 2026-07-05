import { cn } from "@/lib/utils";

const variants = {
  default: "bg-wine-700 text-white hover:bg-wine-800",
  outline: "border border-stone-300 bg-white hover:bg-stone-50",
  ghost: "hover:bg-stone-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
