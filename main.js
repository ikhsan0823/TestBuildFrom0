require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const http = require('http');
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

try {
    mongoose.connect(process.env.DB_URI);
    console.log('Connected to the database!');
} catch (error) {
    console.error('MongoDB connection error:', error);
}

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
});

redisClient.on('error', (err) => {
    if (err.name === 'MaxRetriesPerRequestError') {
      return;
    }

    if (err.code === 'ECONNRESET') {
        console.log('Redis connection is reset!');
        return;
    }

    if (err.code === 'ETIMEDOUT') {
        console.log('Redis connection timed out!');
        return;
    }

    if (err.code === 'ENOTFOUND') {
        console.log("You're not connected!")
        return;
    }

    console.error('Redis connection failed:', err);
  });

app.use(session({
    store: new (require('express-session').MemoryStore)({
        client: redisClient,
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 * 24
    }
}));

app.use("", require("./routes/routes.js"));

const PORT = process.env.PORT || 2002;
server.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});

