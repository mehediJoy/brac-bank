import type { ChangeEvent } from "react";

type FileUploaderProps = {
  label: string;
  helperText?: string;
  fileName?: string;
  onFileSelect: (file: File | null) => void;
};

export function FileUploader({ label, helperText, fileName, onFileSelect }: FileUploaderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files?.[0] ?? null);
  };

  return (
    <label className="flex cursor-pointer flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-600 hover:bg-blue-50">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="text-sm text-slate-500">
        {fileName || helperText || "Choose a file to continue"}
      </span>
      <input className="hidden" type="file" accept="image/*,.pdf" onChange={handleChange} />
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
        Upload file
      </span>
    </label>
  );
}
