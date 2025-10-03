
export type Toast = { id: string; title?: string; description?: string; open?: boolean; };
const MAX_TOASTS = 1;
const AUTO_CLOSE_MS = 2000;
let seq = 0;
function nextId() { seq = (seq + 1) % Number.MAX_SAFE_INTEGER; return String(seq); }
export type State = { toasts: Toast[] };
type Listener = (s: State) => void;
let state: State = { toasts: [] };
let listeners: Listener[] = [];
const timers = new Map<string, number>();
function notify() { listeners.forEach(l => l(state)); }
export function subscribe(l: Listener) { listeners.push(l); l(state); return () => { listeners = listeners.filter(x => x !== l); }; }
function scheduleRemoval(id: string) {
  if (timers.has(id)) return;
  const t = window.setTimeout(() => { timers.delete(id); dispatch({ type: "REMOVE", id }); }, AUTO_CLOSE_MS);
  timers.set(id, t);
}
type Action = { type: "ADD"; toast: Toast } | { type: "UPDATE"; toast: Toast } | { type: "DISMISS"; id?: string } | { type: "REMOVE"; id?: string };
function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "ADD": return { ...s, toasts: [a.toast, ...s.toasts].slice(0, MAX_TOASTS) };
    case "UPDATE": return { ...s, toasts: s.toasts.map(t => t.id === a.toast.id ? { ...t, ...a.toast } : t) };
    case "DISMISS": {
      const id = a.id;
      if (id) scheduleRemoval(id); else s.toasts.forEach(t => scheduleRemoval(t.id));
      return { ...s, toasts: s.toasts.map(t => id ? (t.id === id ? { ...t, open: false } : t) : { ...t, open: false }) };
    }
    case "REMOVE": return a.id ? { ...s, toasts: s.toasts.filter(t => t.id !== a.id) } : { ...s, toasts: [] };
  }
}
function dispatch(a: Action) { state = reducer(state, a); notify(); }
export function addToast(input: Omit<Toast, "id" | "open">) { const id = nextId(); const toast = { id, open: true, ...input }; dispatch({ type: "ADD", toast }); scheduleRemoval(id); return id; }
export function updateToast(toast: Toast) { dispatch({ type: "UPDATE", toast }); }
export function dismissToast(id?: string) { dispatch({ type: "DISMISS", id }); }
