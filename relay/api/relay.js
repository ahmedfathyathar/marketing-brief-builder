// Relay for Startup Helper: passes every request through to the Cloudflare server unchanged.
// It exists because some networks cannot reach workers.dev addresses, but can reach Vercel.
// Nothing is stored here and no keys live here; the API key stays a Cloudflare secret.
export const config = { runtime: "edge" };

const TARGET = "https://startup-helper.ahmed-fathy-05d.workers.dev";
const DROP = new Set(["host", "connection", "content-length", "accept-encoding", "forwarded", "x-real-ip", "x-forwarded-host", "x-forwarded-proto", "x-forwarded-port"]);

export default async function handler(req) {
  const url = new URL(req.url);
  let path = url.searchParams.get("__p") || url.pathname;
  url.searchParams.delete("__p");
  if (!path.startsWith("/")) path = "/" + path;
  const qs = url.searchParams.toString();

  const headers = new Headers();
  for (const [k, v] of req.headers) {
    if (DROP.has(k) || k.startsWith("x-vercel") || k.startsWith("cf-")) continue;
    headers.set(k, v);
  }
  // The admin page opened through this relay calls the relay; the server only accepts its own origin for admin changes.
  const self = "https://" + req.headers.get("host");
  if (req.headers.get("origin") === self) headers.set("origin", TARGET);
  if ((req.headers.get("referer") || "").startsWith(self)) headers.set("referer", TARGET + path);

  const init = { method: req.method, headers, redirect: "manual" };
  if (req.method !== "GET" && req.method !== "HEAD") { init.body = req.body; init.duplex = "half"; }

  let upstream;
  try {
    upstream = await fetch(TARGET + path + (qs ? "?" + qs : ""), init);
  } catch {
    return new Response(JSON.stringify({ error: "upstream_error" }), { status: 502, headers: { "content-type": "application/json", "access-control-allow-origin": "https://ahmedfathyathar.github.io" } });
  }
  const out = new Headers(upstream.headers);
  out.delete("content-encoding");
  out.delete("content-length");
  out.delete("transfer-encoding");
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: out });
}
