const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models/users.js');
const { Daily } = require('../models/dailies.js');

router.get("/", async (req, res) => {
    if (req.session.user || req.session.clientId) {
        const nameUser = await Users.find({ username: req.session.user })
        const name = nameUser.name;
        const username = name || req.session.user;
        res.render("dashboard", { username: username});
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
        req.session.clientId = 'abc123';
        req.session.myNum = 5;

        console.log("Login successfully from " + username + "!");
        req.session.user = username;
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/dashboard", async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }
    const nameUser = await Users.findOne({ username: req.session.user })
    const name = nameUser.name;
    const username = name || req.session.user;
    const usernames = req.session.user;
    res.render("dashboard", { username: username });
});

router.get("/daily", (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }
    res.render('daily')
});

router.post("/dailytask", async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        return res.redirect("/");
    }
    try {
        let newDaily = new Daily({
            username: req.session.user,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            uniqueId: req.body.uniqueId,
            nameday: req.body.nameday
        });

        await newDaily.save();
        res.status(200).json({ success: true, message: 'Daily task saved successfully' });
    } catch (error) {
        console.error("Error saving daily task:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } 
});

router.get("/carddaily", async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }

    try {
        const dailyTasks = await Daily.find({ username: req.session.user });
        const formattedTask = dailyTasks.map(task => ({
            username: task.username,
            title: task.title,
            description: task.description,
            date: task.date,
            uniqueId: task.uniqueId,
            nameday: task.nameday
        }));

        res.json({ dailyTasks: formattedTask });
    } catch (error) {
        console.error("Error retrieving daily tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/dailytask/:uniqueId", async (req, res) => {
    const uniqueId = req.params.uniqueId
    try {
        const deleteTask = await Daily.findOneAndDelete({ uniqueId: uniqueId });

        if (!deleteTask) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error'});
    }
});

module.exports = router;