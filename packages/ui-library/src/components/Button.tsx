import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "success";
    fullWidth?: boolean;
  }
>;

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[rgb(2,103,223)] text-white hover:bg-[rgb(1,92,199)]",
  secondary: "bg-[rgb(2,103,223)] text-white hover:bg-[rgb(1,92,199)]",
  ghost: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
  success: "bg-[rgb(2,103,223)] text-white hover:bg-[rgb(1,92,199)]"
};

export function Button({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
