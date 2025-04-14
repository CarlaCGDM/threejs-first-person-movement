// In a Netlify serverless function
import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  
  const modelStore = getStore("models");
  const modelName = req.path.split("/").pop();
  
  try {
    // Get the model file from blob storage
    const modelData = await modelStore.get(modelName);
    
    if (modelData === null) {
      return {
        statusCode: 404,
        body: "Model not found"
      };
    }
    
    return {
      statusCode: 200,
      body: modelData,
      headers: {
        "Content-Type": "application/octet-stream"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error retrieving model"
    };
  }
}