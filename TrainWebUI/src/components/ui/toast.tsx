"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastKind = "success" | "error" | "info";

type ToastItem = { id: number; message: string; kind: ToastKind };

const ToastCtx = createContext<{
  show: (message: string, kind?: ToastKind) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(1);

  const show = useCallback((message: string, kind: ToastKind = "info") => {
    const id = idRef.current++;
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3000);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {items.map((i) => (
          <div
            key={i.id}
            className={`rounded-lg px-4 py-2 shadow-sm border text-sm ${
              i.kind === "success"
                ? "bg-success text-primary-foreground border-emerald-200"
                : i.kind === "error"
                ? "bg-error text-primary-foreground border-destructive/20"
                : "bg-card text-foreground border-border"
            }`}
          >
            {i.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
