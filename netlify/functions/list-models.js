import { getStore } from "@netlify/blobs";

export default async function handler(event, context) {
  const modelStore = getStore("models");
  
  try {
    // List all models in the store
    const models = await modelStore.list();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ models })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error listing models", error: error.message })
    };
  }
}