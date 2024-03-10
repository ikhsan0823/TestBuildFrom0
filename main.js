require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDBSession = require('connect-mongodb-session')(session);
const ejs = require('ejs');
const http = require('http');

const app = express();
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

try {
    mongoose.connect(process.env.DB_URI);
    console.log('Connected to the database!');
} catch (error) {
    console.error('MongoDB connection error:', error);
}

const store = new mongoDBSession({
    uri: process.env.DB_URI,
    collection: "mySession",
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        saveUninitialized: false,
        resave: false,
        store: store,
        cookie: {
            secure: false,
            httpOnly: true,
            expires: new Date(Date.now() + (1 * 86400 * 1000)),
        }
    })
);

app.use("", require("./routes/routes.js"));

const PORT = process.env.PORT || 2002;
server.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});

