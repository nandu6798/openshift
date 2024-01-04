const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set storage engine and file size limit
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('file');

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Display file upload form
app.get('/', (req, res) => {
  const files = getUploadedFiles();
  res.render('index', { files, errorMessage: null, successMessage: null });
});

// Handle file upload and client-side validation
app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      const files = getUploadedFiles();
      return res.render('index', { files, errorMessage: 'Multer Error: ' + err.message, successMessage: null });
    } else if (err) {
      // An unknown error occurred when uploading
      const files = getUploadedFiles();
      return res.render('index', { files, errorMessage: 'Unknown Error: ' + err.message, successMessage: null });
    }

    // File upload successful
    const files = getUploadedFiles();
	  console.log('files', files);
    return res.render('index', { files, errorMessage: null, successMessage: 'File uploaded successfully!' });
  });
});

// Function to get the list of uploaded files
function getUploadedFiles() {
  const uploadPath = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(uploadPath);
  return files;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
