const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    res.render('index');
});

router.get("/forgotpass", async (req, res) => {
    res.render("forgotpass");
});

module.exports = router;