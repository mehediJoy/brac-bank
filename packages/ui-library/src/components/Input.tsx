import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  error?: string;
};

type TextInputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextAreaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

export function Input(props: TextInputProps | TextAreaProps) {
  const shared =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  if ("as" in props && props.as === "textarea") {
    const { label, error, className = "", as: _as, ...rest } = props;

    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <textarea className={`${shared} min-h-28 resize-none ${className}`} {...rest} />
        {error ? <span className="text-xs text-red-500">{error}</span> : null}
      </label>
    );
  }

  const { label, error, className = "", ...rest } = props;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className={`${shared} ${className}`} {...rest} />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
