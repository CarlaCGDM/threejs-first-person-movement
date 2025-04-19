addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
	const request = event.request;
	const url = new URL(request.url);
	const path = url.searchParams.get('path');

	// 1. SECURITY CHECKS
	const ALLOWED_DOMAINS = ['cova-bonica-virtual-tour-dev.netlify.app', 'localhost'];
	const origin = request.headers.get('Origin') || '';
	const isAllowed = ALLOWED_DOMAINS.some(domain => origin.includes(domain));
	if (!isAllowed) return new Response('Access denied', { status: 403 });

	// 2. SPECIAL HANDLING FOR MANIFESTS
	if (path && path.endsWith('chunk_manifest.json')) {
		try {
			const manifestResponse = await fetch(
				`https://api.cloudflare.com/client/v4/accounts/9ce87ad1267c000dd53fd2a0a6f9672a/r2/buckets/cova-bonica-virtual-tour/objects/${encodeURIComponent(path)}`,
				{ headers: { 'Authorization': `Bearer NtzU3T1efaWucpOFUe0elfVQp_nB2F689cX8OFAE` } }
			);

			console.log(manifestResponse)
			const manifest = await manifestResponse.json();
			console.log(manifest)

			return new Response(JSON.stringify(manifest), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': origin || '*',
					'Cache-Control': 'no-cache'
				}
			});

		} catch (err) {
			return new Response(JSON.stringify({ error: "Manifest generation failed" }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}

	// 3. HANDLE CHUNK REQUESTS
	if (path && path.includes('_Chunks/')) {
		const objectUrl = `https://api.cloudflare.com/client/v4/accounts/9ce87ad1267c000dd53fd2a0a6f9672a/r2/buckets/cova-bonica-virtual-tour/objects/${encodeURIComponent(path)}`;
		const response = await fetch(objectUrl, {
			headers: { 'Authorization': `Bearer NtzU3T1efaWucpOFUe0elfVQp_nB2F689cX8OFAE` }
		});

		if (!response.ok) {
			return new Response(`R2 error: ${path} not found`, {
				status: 404,
				headers: { 'Content-Type': 'text/plain' }
			});
		}

		return new Response(await response.arrayBuffer(), {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Access-Control-Allow-Origin': origin || '*',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	}

	// 4. ORIGINAL GLB HANDLING
	if (path) {
		const objectUrl = `https://api.cloudflare.com/client/v4/accounts/9ce87ad1267c000dd53fd2a0a6f9672a/r2/buckets/cova-bonica-virtual-tour/objects/${encodeURIComponent(path)}`;
		const response = await fetch(objectUrl, {
			headers: { 'Authorization': `Bearer NtzU3T1efaWucpOFUe0elfVQp_nB2F689cX8OFAE` }
		});

		if (!response.ok) return new Response('R2 error', { status: 404 });

		return new Response(await response.arrayBuffer(), {
			headers: {
				'Content-Type': 'model/gltf-binary',
				'Access-Control-Allow-Origin': origin || '*',
				'Cache-Control': 'public, max-age=604800, immutable'
			}
		});
	}

	return new Response('Missing path parameter', { status: 400 });
}