const mongoose = require('mongoose');
const path = require("path");
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const fileSchema = new mongoose.Schema({
    username: String,
    filename: String,
    size: Number,
    uniqueId: String,
    content: Buffer
});

const File = mongoose.model('File', fileSchema);

module.exports = { upload, File };

