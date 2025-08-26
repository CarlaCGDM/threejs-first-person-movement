addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

function makeCorsHeaders(origin) {
  const h = new Headers();
  // Reflect the requesting origin if it’s allowed (filled in below)
  h.set('Access-Control-Allow-Origin', origin);
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Range, Content-Type');
  h.set('Access-Control-Expose-Headers',
        'Accept-Ranges, Content-Length, Content-Range, Content-Type');
  // Nice-to-have:
  h.set('Timing-Allow-Origin', '*');
  h.set('Cross-Origin-Resource-Policy', 'cross-origin');
  return h;
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const { origin: o, hostname, protocol } = new URL(origin);
    if (protocol !== 'http:' && protocol !== 'https:') return false;

    // Allow localhost + your LAN IP (any port)
    if (o.startsWith('http://localhost')) return true;
    if (o.startsWith('http://192.168.1.132')) return true;

    // Exact prod/dev
    if (o === 'https://cova-bonica-virtual-tour.netlify.app') return true;
    if (o === 'https://cova-bonica-virtual-tour-dev.netlify.app') return true;

    // Netlify deploy previews: <branch>--<site>.netlify.app
    if (/^https:\/\/[a-z0-9-]+--cova-bonica-virtual-tour(-dev)?\.netlify\.app$/i.test(o)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const allowed = isAllowedOrigin(origin);

  // Always build CORS headers (reflect allowed origin or fall back to '*'
  // for non-browser tools like curl that don’t send Origin).
  const cors = makeCorsHeaders(allowed ? origin : '*');

  // Respond to preflight early
  if (request.method === 'OPTIONS') {
    // If the origin isn’t allowed, say 403 but STILL include CORS headers
    const status = allowed ? 200 : 403;
    return new Response(null, { status, headers: cors });
  }

  // Block disallowed browser origins (but include CORS so the browser can read the error)
  if (!allowed && origin) {
    return new Response('Access denied', { status: 403, headers: cors });
  }

  const path = url.searchParams.get('path') || '';

  // Validate path
  if (!path) {
    return new Response('Missing path parameter', { status: 400, headers: cors });
  }
  if (path.endsWith('/')) {
    return new Response('Bad path (trailing slash)', { status: 400, headers: cors });
  }

  // Choose content type / caching
  const isGLB = /\.glb$/i.test(path);
  const isChunk = path.includes('_Chunks/');
  const contentType = isGLB
    ? 'model/gltf-binary'
    : isChunk
      ? 'application/octet-stream'
      : 'application/octet-stream';

  // Build Cloudflare API URL (management API you were using)
  const objectUrl = `https://api.cloudflare.com/client/v4/accounts/9ce87ad1267c000dd53fd2a0a6f9672a/r2/buckets/cova-bonica-virtual-tour/objects/${encodeURIComponent(path)}`;

  // IMPORTANT: store your token as a Worker secret and read it via env var.
  // In classic (service-worker) Workers, use globalThis for secrets you bind at deploy.
  const API_TOKEN = R2_API_TOKEN; // <-- bind this in your Worker’s “Variables/Secrets”

  const upstream = await fetch(objectUrl, {
    headers: { 'Authorization': `Bearer ${API_TOKEN}` },
    redirect: 'follow',
  });

  if (!upstream.ok) {
    // Pass through status but make it CORS-friendly
    return new Response(`R2 error for ${path}: ${upstream.status}`, {
      status: upstream.status,
      headers: cors,
    });
  }

  // Copy/augment headers
  const headers = new Headers(cors);
  headers.set('Content-Type', contentType);
  headers.set('Accept-Ranges', 'bytes');

  // Cache longer for chunks, 1 week for originals (tweak if you like)
  headers.set(
    'Cache-Control',
    isChunk
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=604800, immutable'
  );

  return new Response(await upstream.arrayBuffer(), {
    status: 200,
    headers,
  });
}
