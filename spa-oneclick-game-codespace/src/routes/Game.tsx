
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "../util/cn";
import { scheduleBeats, nowMs } from "../util/timing";
import { useClickAudio } from "../hooks/useAudio";

type Hit = { t: number; hit?: number };
const HIT_WINDOW_MS = 120;
const GOOD_WINDOW_MS = 200;
const APPROACH_MS = 1200;
const TRACK_LEN_MS = 45000;

export default function Game() {
  const [bpm, setBpm] = useState(120);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pauseOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const click = useClickAudio();

  useEffect(() => {
    if (!running) return;
    const start = nowMs() + 800;
    // @ts-ignore
    startTimeRef.value = start;
    pauseOffsetRef.current = 0;
    setHits(scheduleBeats({ bpm, startMs: start, lengthMs: TRACK_LEN_MS }).map(t => ({ t })));
    setScore(0); setCombo(0); setAccuracy(0);
    return () => cancelAnim();
  }, [running, bpm]);

  function loop() { rafRef.current = requestAnimationFrame(loop); }
  function startAnim() { cancelAnim(); rafRef.current = requestAnimationFrame(loop); }
  function cancelAnim() { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; }

  useEffect(() => { if (running && !paused) startAnim(); else cancelAnim(); return cancelAnim; }, [running, paused]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running || paused) return;
      if (e.code === "Space" || e.code === "Enter") judge(nowMs());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, paused, hits]);

  function judge(at: number) {
    let idx = -1; let bestDelta = Infinity;
    for (let i = 0; i < hits.length; i++) {
      if (hits[i].hit) continue;
      const d = Math.abs(at - hits[i].t);
      if (d < bestDelta) { bestDelta = d; idx = i; }
    }
    if (idx === -1) return;
    const delta = at - hits[idx].t;
    const abs = Math.abs(delta);
    if (abs <= HIT_WINDOW_MS) { click(); applyHit(idx, at, 300); }
    else if (abs <= GOOD_WINDOW_MS) { click(); applyHit(idx, at, 100); }
  }

  function applyHit(i: number, at: number, points: number) {
    setHits(prev => { const next = prev.slice(); next[i] = { ...next[i], hit: at }; return next; });
    setScore(s => s + points + combo * 2);
    setCombo(c => c + 1);
    const judged = hits.filter(h => h.hit).length + 1;
    const goodish = hits.filter(h => h.hit && Math.abs((h.hit as number) - h.t) <= GOOD_WINDOW_MS).length + 1;
    setAccuracy(Math.round((goodish / judged) * 100));
  }

  function onPause() {
    if (!running) return;
    if (!paused) {
      setPaused(true);
      // @ts-ignore
      pauseOffsetRef.current += nowMs() - (startTimeRef.value ?? nowMs());
      // @ts-ignore
      startTimeRef.value = nowMs();
    } else {
      // @ts-ignore
      startTimeRef.value = nowMs();
      setPaused(false);
    }
  }

  const activeNotes = useMemo(() => hits, [hits]);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Rhythm game prototype</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm">BPM</label>
        <input type="number" className="h-9 w-20 rounded-2xl border border-gray-300 px-3 text-sm"
          min={40} max={240} value={bpm} onChange={e => setBpm(parseInt(e.target.value || "120", 10))} disabled={running} />
        {!running ? <Button onClick={() => setRunning(true)}>Start</Button> : (<>
          <Button variant="secondary" onClick={onPause}>{paused ? "Resume" : "Pause"}</Button>
          <Button onClick={() => setRunning(false)}>Stop</Button>
        </>)}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4"><div className="text-sm text-gray-600 mb-2">Score</div><div className="text-2xl font-semibold">{score}</div></div>
        <div className="rounded-2xl border bg-white p-4"><div className="text-sm text-gray-600 mb-2">Combo</div><div className={cn("text-2xl font-semibold", combo >= 10 && "text-green-600")}>{combo}x</div></div>
        <div className="rounded-2xl border bg-white p-4"><div className="text-sm text-gray-600 mb-2">Accuracy</div><div className="text-2xl font-semibold">{accuracy}%</div></div>
      </div>

      <div className="relative h-[360px] rounded-2xl border bg-white shadow-inner overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-24 w-24 rounded-full border-2 border-black/20" />
        </div>
        <NoteLayer notes={activeNotes} startRef={startTimeRef} />
        <TimeMarker startRef={startTimeRef} />
      </div>

      <p className="text-sm text-gray-600">Press Space or Enter to hit. Notes travel toward the centre. Perfect ±{HIT_WINDOW_MS} ms. Good ±{GOOD_WINDOW_MS} ms.</p>
    </section>
  );
}

function NoteLayer({ notes, startRef }: { notes: Hit[]; startRef: React.MutableRefObject<number | null> }) {
  const [, setTick] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    function frame() { setTick(t => (t + 1) % 60); raf.current = requestAnimationFrame(frame); }
    raf.current = requestAnimationFrame(frame);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);
  const tNow = nowMs();
  // @ts-ignore
  const t0 = startRef.value ?? tNow;

  return (
    <div className="absolute inset-0">
      {notes.map((n, i) => {
        const dt = n.t - tNow;
        const progress = 1 - Math.min(Math.max((dt + 1200) / 1200, 0), 1);
        const scale = 0.4 + 0.6 * progress;
        const opacity = n.hit ? 0.2 : 1;
        const isActive = tNow >= t0 && dt <= 1200 && !n.hit;
        if (!isActive && !n.hit) return null;
        return (
          <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `translate(-50%, -50%) scale(${scale})`, transition: "transform 16ms linear", opacity }}>
            <div className={cn("h-16 w-16 rounded-full", n.hit ? "bg-green-100 border border-green-300" : "bg-black")}/>
          </div>
        );
      })}
    </div>
  );
}

function TimeMarker({ startRef }: { startRef: React.MutableRefObject<number | null> }) {
  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => (t + 1) % 10), 50); return () => clearInterval(id); }, []);
  // @ts-ignore
  const t = Math.max(0, Math.floor(((nowMs() - (startRef.value ?? nowMs())) / 1000)));
  return <div className="absolute bottom-2 left-2 text-xs text-gray-500 select-none">t = {t}s</div>;
}
