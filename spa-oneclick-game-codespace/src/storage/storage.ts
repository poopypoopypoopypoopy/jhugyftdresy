
/** Simulated storage helpers. Replace internals with API calls if needed. */
export async function listFiles(bucket: string): Promise<string[]> { await delay(200); return ["example.txt", "report.pdf", "image.png"]; }
export async function download(bucket: string, path: string): Promise<Blob> { await delay(150); return new Blob([`dummy data for ${bucket}/${path}`], { type: "text/plain" }); }
export function getPublicUrl(bucket: string, path: string): string { const base = "https://example.invalid/storage"; return `${base}/${encodeURIComponent(bucket)}/${encodeURIComponent(path)}`; }
export async function remove(bucket: string, paths: string[]): Promise<{ count: number }> { await delay(100); return { count: paths.length }; }
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
