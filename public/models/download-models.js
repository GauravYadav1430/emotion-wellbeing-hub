
const fs = require('fs');
const path = require('path');

// Complete list of required face-api.js models
const models = [
  // Face detection models (TinyFaceDetector)
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
    path: 'tiny_face_detector_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
    path: 'tiny_face_detector_model-shard1'
  },
  
  // Face landmark detection models
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
    path: 'face_landmark_68_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
    path: 'face_landmark_68_model-shard1'
  },
  
  // Face recognition model
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json',
    path: 'face_recognition_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1',
    path: 'face_recognition_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2',
    path: 'face_recognition_model-shard2'
  },
  
  // Face expression model
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json',
    path: 'face_expression_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1',
    path: 'face_expression_model-shard1'
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
  console.log('Starting model downloads...');
  for (const model of models) {
    await downloadFile(model.url, model.path);
  }
  console.log('Model download process completed.');
}

// Use node-fetch for Node.js environments
if (typeof fetch !== 'function') {
  import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
    downloadModels();
  });
} else {
  downloadModels();
}

