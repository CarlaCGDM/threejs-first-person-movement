import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const { path } = event.queryStringParameters;
  const store = getStore('models');

  try {
    const data = await store.get(path, { type: 'stream' });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'model/gltf-binary' },
      body: data,
      isBase64Encoded: false
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Model not found' })
    };
  }
};