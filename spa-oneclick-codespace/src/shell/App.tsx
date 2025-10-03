
import { Outlet, Link, NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Search } from "lucide-react";
import { useToast } from "../toast/useToast";

export default function App() {
  const { toast } = useToast();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-semibold">SPA One Click</Link>
          <nav className="ml-4 flex gap-3 text-sm">
            <NavLink to="/" end className={({ isActive }) => `px-2 py-1 rounded ${isActive ? "bg-gray-100" : ""}`}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `px-2 py-1 rounded ${isActive ? "bg-gray-100" : ""}`}>About</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
              <Input className="pl-8 w-56" placeholder="Search" />
            </div>
            <Button onClick={() => toast({ title: "Saved", description: "Change saved." })}>Show toast</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Card className="p-4">
          <Outlet />
        </Card>
      </main>
      <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-gray-500">
        <p>Client side only. No server.</p>
      </footer>
    </div>
  );
}
