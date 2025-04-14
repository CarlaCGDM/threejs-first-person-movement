import { getStore } from "@netlify/blobs";
import fs from "fs";
import path from "path";

export default async function handler(event, context) {
  // When running on Netlify, environment variables are automatically set
  const modelStore = getStore("models");
  
  // This is just a simple check to prevent unauthorized access
  // In production, you'd want better authentication
  if (event.headers.authorization !== process.env.UPLOAD_SECRET) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" })
    };
  }
  
  try {
    // Parse the uploaded file from the request body
    const { fileName, fileContent } = JSON.parse(event.body);
    
    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or fileContent" })
      };
    }
    
    // Store the file in blob storage
    await modelStore.set(fileName, Buffer.from(fileContent, 'base64'));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Uploaded ${fileName} successfully` })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error uploading file", error: error.message })
    };
  }
}