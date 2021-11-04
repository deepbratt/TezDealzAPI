const multer = require('multer');
const { memoryStorage } = require('multer');

// Multer Upload Storage
const storage = multer.memoryStorage();

// Filter for CSV file
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes('csv')) {
    cb(null, true);
  } else {
    cb('Please upload only csv file.', false);
  }
};
const fileUpload = multer({ storage: storage, fileFilter: csvFilter });

module.exports = fileUpload;
