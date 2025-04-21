
const fs = require('fs');
const path = require('path');

const models = [
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-shard1',
    path: 'face_expression_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-weights_manifest.json',
    path: 'face_expression_model-weights_manifest.json'
  }
];

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname);
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Async function to download a file
async function downloadFile(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.join(modelsDir, filePath), Buffer.from(buffer));
    console.log(`Successfully downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${filePath}:`, error.message);
  }
}

// Download all models
async function downloadModels() {
  for (const model of models) {
    await downloadFile(model.url, model.path);
  }
  console.log('Model download process completed.');
}

downloadModels();
