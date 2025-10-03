
import { createContext, useContext, useEffect, useState } from "react";
import { State, subscribe, addToast, dismissToast, updateToast } from "./store";
type Ctx = { state: State; toast: (o: { title?: string; description?: string }) => void; dismiss: (id?: string) => void; update: typeof updateToast; };
const Ctx = createContext<Ctx | null>(null);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ toasts: [] });
  useEffect(() => subscribe(setState), []);
  return <Ctx.Provider value={{ state, toast: addToast, dismiss: dismissToast, update: updateToast }}>{children}</Ctx.Provider>;
}
export function useToast() { const ctx = useContext(Ctx); if (!ctx) throw new Error("ToastProvider missing"); return ctx; }
