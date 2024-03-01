const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models/users.js');

router.get("/", async (req, res) => {
    if (req.session.user) {
        const nameUser = await Users.findOne({ username: req.session.user })
        const name = nameUser.name;
        const username = name || req.session.user;
        res.render("dashboard", { username: username });
        return;
    }
    res.render('index');
});

router.get("/forgotpass", async (req, res) => {
    res.render("forgotpass");
});

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await Users.findOne({ username: username });

        if (!user || !bcrypt.compare(password, user.password)) {
            const alertScript = `
                <script>
                    alert('Invalid username or password. Please try again.');
                    window.location.href = '/';
                </script>
            `;
            res.send(alertScript);
            return;
        }
        console.log("Login successfully!");
        res.render("dashboard");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/dashboard", async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
        return;
    }
    const nameUser = await Users.findOne({ username: req.session.user })
    const name = nameUser.name;
    const username = name || req.session.user;
    res.render("dashboard", { username: username });
});

module.exports = router;