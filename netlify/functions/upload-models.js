import { getStore } from "@netlify/blobs";

export default async function handler(event, context) {
  // Check authorization first
  if (event.headers.authorization !== process.env.UPLOAD_SECRET) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" })
    };
  }

  // Check for POST method
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }

  try {
    // Parse the body (Netlify already parses it if content-type is application/json)
    const { fileName, fileContent } = JSON.parse(event.body);
    
    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or fileContent" })
      };
    }

    // Check file size (rough estimate)
    const sizeInBytes = (fileContent.length * 3) / 4; // base64 is ~33% larger
    if (sizeInBytes > 5 * 1024 * 1024) { // 5MB
      return {
        statusCode: 413,
        body: JSON.stringify({ 
          message: "File too large",
          details: `File ${fileName} is ${(sizeInBytes / (1024 * 1024)).toFixed(2)}MB (Netlify limit is 6MB)`
        })
      };
    }

    const modelStore = getStore("models");
    await modelStore.set(fileName, Buffer.from(fileContent, 'base64'));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Uploaded ${fileName} successfully` })
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error uploading file",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      })
    };
  }
}