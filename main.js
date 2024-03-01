require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const http = require('http');

const app = express();
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", 'ejs');

try {
    mongoose.connect(process.env.DB_URI);
    console.log('Connected to the database!');
} catch (error) {
    console.error('MongoDB connection error:', error);
}

app.use("", require("./routes/routes.js"));

const PORT = process.env.PORT || 2002;
server.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});

