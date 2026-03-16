import type { ChangeEvent } from "react";

type FileUploaderProps = {
  label: string;
  helperText?: string;
  fileName?: string;
  imagePreview?: string | null;
  imageMeta?: {
    type: string;
    sizeKb: number;
    width: number;
    height: number;
  } | null;
  onFileSelect: (file: File | null) => void;
};

export function FileUploader({
  label,
  helperText,
  fileName,
  imagePreview,
  imageMeta,
  onFileSelect
}: FileUploaderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files?.[0] ?? null);
  };

  return (
    <label className="flex cursor-pointer flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-600 hover:bg-blue-50">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {imagePreview ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
          <img src={imagePreview} alt="Preview" className="h-44 w-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm">
              Click to replace
            </span>
          </div>
        </div>
      ) : (
        <span className="text-sm text-slate-500">
          {fileName || helperText || "Choose a file to continue"}
        </span>
      )}
      <input className="hidden" type="file" accept="image/*,.pdf" onChange={handleChange} />
      {imageMeta ? (
        <div className="space-y-1 rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
          <p className="font-medium text-slate-700">{fileName}</p>
          <p>Type: {imageMeta.type || "Unknown"}</p>
          <p>Size: {imageMeta.sizeKb.toFixed(1)} KB</p>
          <p>
            Resolution: {imageMeta.width} x {imageMeta.height}
          </p>
        </div>
      ) : null}
      {!imagePreview && (
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          Upload file
        </span>
      )}
    </label>
  );
}
