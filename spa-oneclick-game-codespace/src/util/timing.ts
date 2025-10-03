
export function nowMs() { return performance.now(); }
export function scheduleBeats(opts: { bpm: number; startMs: number; lengthMs: number }): number[] {
  const { bpm, startMs, lengthMs } = opts;
  const interval = 60000 / bpm;
  const times: number[] = [];
  for (let t = startMs; t <= startMs + lengthMs; t += interval) times.push(t);
  return times;
}
