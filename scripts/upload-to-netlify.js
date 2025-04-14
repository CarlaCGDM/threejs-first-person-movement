import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// Set this to your deployed Netlify site
const NETLIFY_SITE_URL = "https://cova-bonica-virtual-tour-dev.netlify.app/";
// Set this to match what you'll set in Netlify environment variables
const UPLOAD_SECRET = "mysecret";

async function uploadModels() {
  const modelsDir = path.join(process.cwd(), "models");
  const files = fs.readdirSync(modelsDir);
  
  console.log(`Found ${files.length} files to upload`);
  
  for (const file of files) {
    const filePath = path.join(modelsDir, file);
    const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
    
    console.log(`Uploading ${file}...`);
    
    try {
      const response = await fetch(`${NETLIFY_SITE_URL}/.netlify/functions/upload-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': UPLOAD_SECRET
        },
        body: JSON.stringify({
          fileName: file,
          fileContent: fileContent
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`Success: ${result.message}`);
      } else {
        console.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error uploading ${file}: ${error.message}`);
    }
  }
  
  console.log("Upload process completed");
}

uploadModels().catch(console.error);