import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// Set this to your deployed Netlify site
const NETLIFY_SITE_URL = "https://cova-bonica-virtual-tour-dev.netlify.app/";
// Set this to match what you'll set in Netlify environment variables
const UPLOAD_SECRET = "mysecret";

// Function to recursively get all files from a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Add both the full path and the relative path (for blob storage)
      const relativePath = path.relative(path.join(process.cwd(), "public/assets/models"), fullPath);
      arrayOfFiles.push({ fullPath, relativePath });
    }
  });

  return arrayOfFiles;
}

async function uploadModels() {
  const modelsDir = path.join(process.cwd(), "public/assets/models");
  const files = getAllFiles(modelsDir);
  
  console.log(`Found ${files.length} files to upload (including in subdirectories)`);
  
  for (const { fullPath, relativePath } of files) {
    console.log(`Processing ${relativePath}...`);
    
    try {
      const fileContent = fs.readFileSync(fullPath, { encoding: 'base64' });
      console.log(`Uploading ${relativePath}...`);
      
      const response = await fetch(`${NETLIFY_SITE_URL}/.netlify/functions/upload-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': UPLOAD_SECRET
        },
        body: JSON.stringify({
          fileName: relativePath, // Use relative path to maintain directory structure
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
      console.error(`Error uploading ${relativePath}: ${error.message}`);
    }
  }
  
  console.log("Upload process completed");
}

uploadModels().catch(console.error);