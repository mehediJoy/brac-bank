import type { PropsWithChildren, ReactNode } from "react";

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}>;

export function Card({ title, description, actions, className = "", children }: CardProps) {
  return (
    <section className={`rounded-xl bg-white p-6 shadow-card ${className}`}>
      {(title || description || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {description ? <p className="text-sm text-slate-500">{description}</p> : null}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
