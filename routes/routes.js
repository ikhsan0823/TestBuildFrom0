const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models/users.js');
const { Daily } = require('../models/dailies.js');
const { Balance, History } = require('../models/money.js');

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

router.get("/money", (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }
    res.render('money');
});

router.get('/getBalance', async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }
    try {
        const balance = await Balance.findOne({ username: req.session.user });
        if (balance) {
            res.setHeader('Content-Type', 'application/json');
            res.json({ value: balance.value });
        } else {
            res.status(404).json({ error: 'Balance data not found!' });
        }
    } catch (error) {
        console.error('An error occurred while getting the balance:', error);
        res.status(500).send('An error occurred while getting the balance,');
    }
});

router.post('/updateBalance', async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }
    const newValue = req.body.balance;
    try {
        await Balance.findOneAndUpdate({ username: req.session.user }, { value: newValue }, { upsert: true, new: true });
        res.send('Successfully updated balance.');
    } catch (error) {
        res.status(500).send('An error occurred while updating the balance!');
    }
});

router.post("/history", async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        return res.redirect("/");
    }
    try {
        const currentHistory = await History.find({ username: req.session.user });
        if (currentHistory.length >= 10) {
            const oldestHistory = currentHistory.shift();
            await History.findByIdAndDelete(oldestHistory._id);
        };
        let newHistory = new History({
            username: req.session.user,
            formattedDate: req.body.formattedDate,
            formattedTime: req.body.formattedTime,
            type: req.body.type,
            amount: req.body.amount
        });

        await newHistory.save();
        res.status(200).json({ success: true, message: 'Daily task saved successfully' });
    } catch (error) {
        console.error("Error saving daily task:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } 
});

router.delete("/history/delete", async (req, res) => {
    const username = req.session.user;
    try {
        const deleteHistory = await History.deleteMany({ username: username });

        if (deleteHistory.deletedCount === 0) {
            res.status(404).json({ success: false, message: 'History not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'All tasks deleted successfully' });
    } catch (error) {
        console.error("Error deleting history:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get("/gethistory", async (req, res) => {
    if (!req.session.user || !req.session.clientId) {
        res.redirect("/");
        return;
    }

    try {
        const getHistory = await History.find({ username: req.session.user });
        const formattedHistory = getHistory.map(history => ({
            username: history.username,
            formattedDate: history.formattedDate,
            formattedTime: history.formattedTime,
            type: history.type,
            amount: history.amount
        }));
        
        res.setHeader('Content-Type', 'application/json');
        res.json({ getHistory: formattedHistory });
    } catch (error) {
        console.error("Error retrieving daily tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/setting", async (req, res) => {
    try {
        if (!req.session.user || !req.session.clientId) {
            res.redirect("/");
            return;
        }

        const username = req.session.user;
        const account = await Users.find({ username: username });
        const accountInfo = account.map((users) => ({
            name: users.name,
            email: users.email,
            gender: users.gender,
            phoneNum: users.phoneNum,
            birth: users.birth,
        }));

        res.render('setting', { username: username, users: accountInfo });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/editProfile", async (req, res) => {
    try {
        const { name, email, birth, gender, phoneNum } = req.body;
        const user = await Users.find({ username: req.session.user });

        await Users.findOneAndUpdate({ username: req.session.user }, {
            $set: {
                name: name || user.name,
                email: email || user.email,
                birth: birth || user.birth,
                gender: gender || user.gender,
                phoneNum: phoneNum || user.phoneNum,
            }
        });
        res.redirect('setting');
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memperbarui profil');
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.json({ success: true, message: "Logout successful" });
        }
    });
});

module.exports = router;