const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPhoto, getPhotos } = require('../controllers/photoController');
const { protect } = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

// Make sure 'uploads' folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', protect, upload.single('photo'), uploadPhoto);
router.get('/', protect, getPhotos);

module.exports = router;
