
const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Directly download file using Node.js https module (no fetch dependency)
async function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(modelsDir, filePath);
    const file = fs.createWriteStream(fullPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded: ${filePath}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(fullPath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Download all models
async function downloadModels() {
  console.log('Starting model downloads...');
  for (const model of models) {
    try {
      await downloadFile(model.url, model.path);
    } catch (error) {
      console.error(`Error downloading ${model.path}:`, error.message);
    }
  }
  console.log('Model download process completed.');
}

downloadModels();
