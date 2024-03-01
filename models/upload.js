const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: '../upload/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5},
}).single('myfile');

const fileSchema = new mongoose.Schema({
    username: String,
    filename: String,
    path: String,
    size: Number,
    uniqueId: String
});

const File = mongoose.model('File', fileSchema);

module.exports = { upload, File };

