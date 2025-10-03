
import { useToast } from "./ToastProvider";
import { X } from "lucide-react";
export function ToastViewport() {
  const { state, dismiss } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {state.toasts.map(t => (
        <div key={t.id} className="w-72 rounded-2xl border bg-white shadow-lg p-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {t.title && <div className="font-medium">{t.title}</div>}
              {t.description && <div className="text-gray-600">{t.description}</div>}
            </div>
            <button aria-label="Dismiss" className="p-1 rounded hover:bg-gray-100" onClick={() => dismiss(t.id)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
