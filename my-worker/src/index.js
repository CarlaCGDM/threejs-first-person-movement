addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event));
  });
  
  async function handleRequest(event) {
	const request = event.request;
	
	// 1. SECURITY CHECKS
	const ALLOWED_DOMAINS = [
	  'cova-bonica-virtual-tour-dev.netlify.app',
	  'localhost'
	];
	const origin = request.headers.get('Origin') || '';
	const referer = request.headers.get('Referer') || '';
	const isAllowed = ALLOWED_DOMAINS.some(domain =>
	  origin.includes(domain) || referer.includes(domain)
	);
  
	if (!isAllowed) return new Response('Access denied', { status: 403 });
  
	// 2. GET PATH PARAMETER
	const path = new URL(request.url).searchParams.get('path');
	if (!path) return new Response('Missing path', { status: 400 });
  
	// 3. FETCH FROM R2 (with browser caching only)
	const objectUrl = `https://api.cloudflare.com/client/v4/accounts/9ce87ad1267c000dd53fd2a0a6f9672a/r2/buckets/cova-bonica-virtual-tour/objects/${encodeURIComponent(path)}`;
	const response = await fetch(objectUrl, {
	  headers: {
		'Authorization': `Bearer NtzU3T1efaWucpOFUe0elfVQp_nB2F689cX8OFAE`
	  }
	});
  
	if (!response.ok) return new Response('R2 error', { status: 404 });
  
	// 4. RETURN WITH BROWSER CACHING HEADERS
	return new Response(await response.arrayBuffer(), {
	  headers: {
		'Content-Type': 'model/gltf-binary',
		'Access-Control-Allow-Origin': origin || '*',
		'Cache-Control': 'public, max-age=604800, immutable', // 1 week cache
		'CDN-Cache-Control': 'public, max-age=60' // Short CDN cache
	  }
	});
  }