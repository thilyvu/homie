"use client";

import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { useToast, type ToastTone } from "@/context/ui";

const tones: Record<ToastTone, string> = {
  success: "bg-success-bg text-success",
  error: "bg-error-bg text-error",
  info: "bg-warn-bg text-matcha",
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();
  if (!toasts.length) return null;
  return (
    <div className="fixed right-4 bottom-4 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={`motion-pop flex gap-3 p-4 text-left ${tones[toast.tone]}`}
        >
          {toast.tone === "success" ? <CircleCheck className="size-5 shrink-0" /> : null}
          {toast.tone === "error" ? <CircleAlert className="size-5 shrink-0" /> : null}
          {toast.tone === "info" ? <Info className="size-5 shrink-0" /> : null}
          <span>
            <span className="block text-[13px] font-bold">{toast.title}</span>
            {toast.description ? <span className="mt-0.5 block text-xs text-muted">{toast.description}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
