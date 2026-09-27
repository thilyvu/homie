"use client";

import { useEffect } from "react";
import { CmsProvider } from "@/context/cms";
import { LocaleProvider, ToastProvider } from "@/context/ui";
import { ToastViewport } from "@/components/ui/Toast";
import { initAnalytics } from "@/lib/firebase";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <LocaleProvider>
      <ToastProvider>
        <CmsProvider>
          {children}
          <ToastViewport />
        </CmsProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}
