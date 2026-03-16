export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-6">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
