
export function useClickAudio() {
  let ctx: AudioContext | null = null;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
  }
  return function click() {
    const ac = ensure();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "square"; o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ac.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.08);
    o.connect(g).connect(ac.destination);
    o.start(); o.stop(ac.currentTime + 0.09);
  };
}
