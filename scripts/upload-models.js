// scripts/upload-models.js
import { getStore } from "@netlify/blobs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const store = getStore("models");
const modelsDir = path.join(__dirname, "../../public/assets/models"); // Adjust path as needed

async function uploadModels(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await uploadModels(fullPath); // Recurse into subfolders
    } else if (file.name.endsWith(".glb")) {
      const blobKey = path.relative(modelsDir, fullPath); // e.g., "CovaBonia_LODs/LOD_00.glb"
      const data = fs.readFileSync(fullPath);
      
      await store.set(blobKey, data);
      console.log(`Uploaded: ${blobKey}`);
    }
  }
}

uploadModels(modelsDir).catch(console.error);