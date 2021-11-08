const mongoose = require('mongoose');

const bulkUploadSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    csvFile: {
      type: String,
      required: [true, 'Please Add a file'],
    },
    successCount: {
      type: Number,
    },
    failedCount: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const BulkUploads = mongoose.model('BulkUploads', bulkUploadSchema);

module.exports = BulkUploads;
