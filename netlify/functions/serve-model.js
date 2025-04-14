// netlify/functions/serve-model.js
import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  // This works in production automatically
  // For local testing, we'll add a fallback
  const store = process.env.NETLIFY_SITE_ID 
    ? getStore('models') // Production
    : getStore('models', {
        siteID: '62f44a5a-ba8e-4d55-b9a8-90c95f43cf16',
        token: 'nfp_9g9vj2ycKZnC5WxeuXp6RMRsUhnfW8ej8333',
        apiURL: 'https://api.netlify.com'
      });

  const { path } = event.queryStringParameters;
  const data = await store.get(path, { type: 'stream' });
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'model/gltf-binary' },
    body: data,
    isBase64Encoded: false
  };
};