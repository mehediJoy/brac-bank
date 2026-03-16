import type { RefObject } from "react";

type CameraPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  imageSrc?: string | null;
  status: "idle" | "captured" | "verifying" | "verified";
};

const statusText: Record<CameraPreviewProps["status"], string> = {
  idle: "Camera ready for capture",
  captured: "Image captured. Ready for verification.",
  verifying: "Verifying liveness...",
  verified: "Liveness verified"
};

export function CameraPreview({ videoRef, imageSrc, status }: CameraPreviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-950/95 p-4 text-white">
      <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
        {imageSrc ? (
          <img className="h-full w-full object-cover" src={imageSrc} alt="Liveness capture" />
        ) : (
          <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
        )}
      </div>
      <p className="mt-3 text-sm text-slate-300">{statusText[status]}</p>
    </div>
  );
}
