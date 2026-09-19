// Tiny Redis client for Upstash's REST API (no npm dependency).
// Vercel's Upstash integration sets either UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN.
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// In-memory fallback so the site runs locally without a database. Data resets on restart.
const mem = globalThis.__cppsMem || (globalThis.__cppsMem = new Map());
function memCmd([cmd, key, ...args]) {
  switch (cmd.toUpperCase()) {
    case 'GET': return mem.has(key) ? mem.get(key) : null;
    case 'SET': {
      if (args.includes('NX') && mem.has(key)) return null;
      mem.set(key, String(args[0])); return 'OK';
    }
    case 'INCR': { const v = Number(mem.get(key) || 0) + 1; mem.set(key, String(v)); return v; }
    case 'MGET': return [key, ...args].map(k => (mem.has(k) ? mem.get(k) : null));
    default: throw new Error('Unsupported in memory mode: ' + cmd);
  }
}

async function redis(command) {
  if (!URL_ || !TOKEN) return memCmd(command);
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `Redis HTTP ${res.status}`);
  return data.result;
}

module.exports = { redis, usingMemory: !URL_ || !TOKEN };
