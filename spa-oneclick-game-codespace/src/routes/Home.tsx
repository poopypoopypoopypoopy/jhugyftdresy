
import { Button } from "../ui/Button";
import { Download, Play } from "lucide-react";
import { listFiles, getPublicUrl } from "../storage/storage";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [files, setFiles] = useState<string[]>([]);
  async function load() { setFiles(await listFiles("demo")); }
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Home</h1>
      <p className="text-sm text-gray-600">Demo of storage helpers and UI primitives. Plus a playable rhythm game prototype.</p>
      <div className="flex gap-2">
        <Button onClick={load}>List files</Button>
        <Button variant="secondary" onClick={() => window.open(getPublicUrl("demo","example.txt"), "_blank")}>
          <Download className="h-4 w-4 mr-1" /> Open public URL
        </Button>
        <Link to="/game">
          <Button className="ml-2"><Play className="h-4 w-4 mr-1" /> Start game</Button>
        </Link>
      </div>
      <ul className="list-disc pl-5 text-sm">
        {files.length === 0 ? <li>No files.</li> : files.map(f => <li key={f}>{f}</li>)}
      </ul>
    </section>
  );
}
