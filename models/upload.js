const mongoose = require('mongoose');
const path = require("path");

const fileSchema = new mongoose.Schema({
    username: String,
    filename: String,
    path: String,
    size: Number,
    uniqueId: String
});

const File = mongoose.model('File', fileSchema);

module.exports = { File };

