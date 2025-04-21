
const fs = require('fs');
const https = require('https');
const path = require('path');

const models = [
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json',
    path: 'tiny_face_detector_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1',
    path: 'tiny_face_detector_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json',
    path: 'face_landmark_68_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1',
    path: 'face_landmark_68_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json',
    path: 'face_recognition_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1',
    path: 'face_recognition_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression_model-weights_manifest.json',
    path: 'face_expression_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression_model-shard1',
    path: 'face_expression_model-shard1'
  }
];

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname);
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Download each model file
models.forEach(model => {
  const filePath = path.join(modelsDir, model.path);
  
  https.get(model.url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`Downloaded: ${model.path}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${model.path}:`, err.message);
  });
});

console.log('Starting model downloads...');
