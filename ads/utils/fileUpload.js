const multer = require('multer');
const { memoryStorage } = require('multer');
const { AppError } = require('@utils/tdb_globalutils');

// const upload = (mineType) => {
//   return multer({
//     storage: memoryStorage(),
//     fileFilter: (req, file, callback) => {
//       if (file.mimetype.startsWith(mineType)) {
//         callback(null, true);
//       } else {
//         callback(new AppError(`Not an ${mineType} ! Please upload only ${mineType}`, 400), false);
//       }
//     },
//   });
// };

// module.exports = upload;

// Multer Upload Storage
// const storage = multer.memoryStorage({});

// // Filter for CSV file
// const csvFilter = (req, file, cb) => {
//   if (file.mimetype.includes('csv')) {
//     cb(null, true);
//   } else {
//     cb('Please upload only csv file.', false);
//   }
// };
// const fileUpload = multer({ storage: storage, fileFilter: csvFilter });

// module.exports = fileUpload;
