const asyncHandler = require('express-async-handler');
const Photo = require('../models/photoModel');
const fs = require('fs');
const path = require('path');

// @desc Upload a new photo
// @route POST /api/photos
// @access Private
const uploadPhoto = asyncHandler(async (req, res) => {
  console.log('req.file:', req.file);

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Read file into buffer for MongoDB
  const fileBuffer = fs.readFileSync(req.file.path);

  const photo = await Photo.create({
    user: req.user ? req.user.id : null,
    filename: req.file.filename,
    data: fileBuffer,
    contentType: req.file.mimetype,
  });

  // Optionally, delete file from disk after saving to DB
  fs.unlinkSync(req.file.path);

  res.status(201).json({
    _id: photo.id,
    filename: photo.filename,
    contentType: photo.contentType,
  });
});

// @desc Get all photos
// @route GET /api/photos
// @access Private
const getPhotos = asyncHandler(async (req, res) => {
  const photos = await Photo.find({ user: req.user.id });
  res.json(photos);
});

module.exports = { uploadPhoto, getPhotos };

