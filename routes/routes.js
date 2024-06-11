const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Users } = require("../models/users.js");
const { Daily } = require("../models/dailies.js");
const { Balance, History } = require("../models/money.js");
const { upload, File } = require("../models/upload.js");
const { parse } = require("path");

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
    return;
  }
};

router.get("/", async (req, res) => {
  if (req.session.isAuth) {
    const nameUser = await Users.findOne({ username: req.session.user });
    if (nameUser) {
      res.render("dashboard", {
        username: nameUser.name || req.session.user,
        usernames: req.session.user,
      });
    }
    return;
  }
  res.render("index");
});

router.post("/signup", async function (req, res) {
  try {
    const existingUser = await Users.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      const alertScript = `
                <script>
                    alert('Username or email already taken!');
                    window.location.href = '/';
                </script>
            `;
      res.send(alertScript);
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newUsers = new Users({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    let newBalance = new Balance({
      username: req.body.username,
      value: 0,
    });

    await newUsers.save();
    await newBalance.save();

    res.redirect("/");
  } catch (error) {
    console.error("An error occurred during signup:", error);
    res.status(500).send("An error occurred during signup.");
  }
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
    req.session.isAuth = true;

    console.log("Login successfully from " + username + "!");
    req.session.user = username;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const nameUser = await Users.findOne({ username: req.session.user });
  if (nameUser) {
    res.render("dashboard", {
      username: nameUser.name || req.session.user,
      usernames: req.session.user,
    });
  }
});

router.get("/daily", isAuthenticated, async (req, res) => {
  res.render("daily");
});

router.post("/dailytask", async (req, res) => {
  const { title, description, date, time, uploadPhoto, uniqueId} = req.body;
  try {
    let newDaily = new Daily({
      username: req.session.user,
      title,
      description,
      date,
      time,
      uniqueId,
      uploadPhoto,
      complete: false,
    });

    await newDaily.save();
    res
      .status(200)
      .json({ success: true, message: "Daily task saved successfully" });
  } catch (error) {
    console.error("Error saving daily task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/dailytasks", async (req, res) => {
  try {
    const username = req.session.user;
    const tasks = await Daily.aggregate([
      { $match: { username: username } },
      { $group: { 
          _id: "$date",
          count: { $sum: 1 },
          completeCount: { $sum: { $cond: [ "$complete", 1, 0 ] } },
          tasks: { $push: "$$ROOT" }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching daily tasks:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post('/getdetailtask', async (req, res) => {
  try {
    const { date } = req.body;
    const username = req.session.user;
    const parsedDate = new Date(date);

    const tasks = await Daily.find({
      date: {
        $eq: parsedDate
      },
      username: username
    });

    console.log(tasks);

    res.status(200).json(tasks);
  } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/gettruetask", async (req, res) => {
  const { uniqueId } = req.body;
  const task = await Daily.findOne({ uniqueId: uniqueId });
  task.complete = true;

  await task.save();
  res.status(200).send({ message: "Task updated successfully", task });
})

router.get("/carddaily", async (req, res) => {
  try {
    const dailyTasks = await Daily.find({ username: req.session.user });
    const formattedTask = dailyTasks.map((task) => ({
      username: task.username,
      title: task.title,
      description: task.description,
      date: task.date,
      uniqueId: task.uniqueId,
      nameday: task.nameday,
    }));

    res.json({ dailyTasks: formattedTask });
  } catch (error) {
    console.error("Error retrieving daily tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/dailytask/:uniqueId", async (req, res) => {
  const uniqueId = req.params.uniqueId;
  try {
    const deleteTask = await Daily.findOneAndDelete({ uniqueId: uniqueId });

    if (!deleteTask) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/upload", upload.single("myfile"), async (req, res) => {
  if (req.file) {
    const fileBuffer = req.file.buffer.toString('base64');
    const newFile = new File({
      username: req.session.user,
      filename: req.file.originalname,
      size: req.file.size,
      uniqueId: req.body.uniqueId,
      content: fileBuffer,
    });

    try {
      await newFile.save();
      await Daily.findOneAndDelete({ uniqueId: req.body.uniqueId });
      res.redirect("daily");
    } catch (error) {
      console.error("Error saving file info to MongoDB:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "Tidak ada file yang diberikan" });
  }
});

router.get("/setting", async (req, res) => {
  try {
    const username = req.session.user;
    const account = await Users.find({ username: username });
    const accountInfo = account.map((users) => ({
      name: users.name,
      email: users.email,
      gender: users.gender,
      phoneNum: users.phoneNum,
      birth: users.birth,
    }));

    res.render("setting", { username: username, users: accountInfo });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/editProfile", async (req, res) => {
  try {
    const { name, email, birth, gender, phoneNum } = req.body;
    const user = await Users.find({ username: req.session.user });

    await Users.findOneAndUpdate(
      { username: req.session.user },
      {
        $set: {
          name: name || user.name,
          email: email || user.email,
          birth: birth || user.birth,
          gender: gender || user.gender,
          phoneNum: phoneNum || user.phoneNum,
        },
      }
    );
    res.redirect("setting");
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat memperbarui profil");
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thisistips919@gmail.com",
    pass: "qwtmgtvljuobrxks",
  },
});

const generateToken = () => {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  return token;
};

router.post("/forgot-password", async (req, res) => {
  try {
    const { emailpass } = req.body;
    const user = await Users.findOne({ email: emailpass });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken();
    user.resetToken = resetToken;
    await user.save();

    const mailOptions = {
      from: "thisistips919@gmail.com",
      to: emailpass,
      subject: "My SelfManage Account Password Reset",
      text: `Your token is ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

router.post("/change-email", async (req, res) => {
  try {
    const { firstEmail } = req.body;
    const user = await Users.findOne({ email: firstEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken();
    user.resetToken = resetToken;
    await user.save();

    const mailOptions = {
      from: "thisistips919@gmail.com",
      to: firstEmail,
      subject: "My SelfManage Account Email Change",
      text: `Your token is ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Token sending to email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
})

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await Users.findOne({ resetToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();
    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ success: true, message: "Logout successful" });
    }
  });
});

router.get("/money", isAuthenticated, async (req, res) => {
  const balance = await Balance.findOne({ username: req.session.user });
  const value = balance.value;
  res.render("money", { usernames: req.session.user, value: value });
});

router.post("/addvalue", async (req, res) => {
  const { value, formattedDate, formattedTime, type, amount } = req.body;
  const balance = await Balance.findOne({ username: req.session.user });
  const values = balance.value;
  const balanceTotal = value + values;
  try {
    const currentHistory = await History.find({ username: req.session.user });
    if (currentHistory.length >= 10) {
      const oldestHistory = currentHistory.shift();
      await History.findByIdAndDelete(oldestHistory._id);
    }
    let newHistory = new History({
      username: req.session.user,
      formattedDate: formattedDate,
      formattedTime: formattedTime,
      type: type,
      amount: amount,
    });
    await newHistory.save();
    const update = await Balance.findOneAndUpdate(
      { username: req.session.user },
      { value: balanceTotal },
      { upsert: true, new: true }
    );
    if (update) {
      const data = update.value;
      res.json(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the balance!" });
  }
});

router.post("/minvalue", async (req, res) => {
  const { value, formattedDate, formattedTime, type, amount } = req.body;
  const balance = await Balance.findOne({ username: req.session.user });
  const values = balance.value;
  const balanceTotal = values - value;
  try {
    const currentHistory = await History.find({ username: req.session.user });
    if (currentHistory.length >= 10) {
      const oldestHistory = currentHistory.shift();
      await History.findByIdAndDelete(oldestHistory._id);
    }
    let newHistory = new History({
      username: req.session.user,
      formattedDate: formattedDate,
      formattedTime: formattedTime,
      type: type,
      amount: amount,
    });

    await newHistory.save();
    const update = await Balance.findOneAndUpdate(
      { username: req.session.user },
      { value: balanceTotal },
      { upsert: true, new: true }
    );
    if (update) {
      const data = update.value;
      res.json(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the balance!" });
  }
});

router.post("/resetvalue", async (req, res) => {
  const { value, formattedDate, formattedTime, type } = req.body;
  try {
    const currentHistory = await History.find({ username: req.session.user });
    if (currentHistory.length >= 10) {
      const oldestHistory = currentHistory.shift();
      await History.findByIdAndDelete(oldestHistory._id);
    }
    let newHistory = new History({
      username: req.session.user,
      formattedDate: formattedDate,
      formattedTime: formattedTime,
      type: type,
    });

    await newHistory.save();
    const update = await Balance.findOneAndUpdate(
      { username: req.session.user },
      { value: value },
      { upsert: true, new: true }
    );
    if (update) {
      const data = update.value;
      res.json(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the balance!" });
  }
});

router.get("/gethistory", async (req, res) => {
  try {
    const getHistory = await History.find({ username: req.session.user });
    const formattedHistory = getHistory.map((history) => ({
      username: history.username,
      formattedDate: history.formattedDate,
      formattedTime: history.formattedTime,
      type: history.type,
      amount: history.amount,
    }));

    res.setHeader("Content-Type", "application/json");
    res.json({ getHistory: formattedHistory });
  } catch (error) {
    console.error("Error retrieving daily tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/history/delete", async (req, res) => {
  const username = req.session.user;
  try {
    const deleteHistory = await History.deleteMany({ username: username });

    if (deleteHistory.deletedCount === 0) {
      res.status(404).json({ success: false, message: "History not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "All tasks deleted successfully" });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/display", isAuthenticated, async (req, res) => {
  try{
    const files = await File.find({ username: req.session.user });
    if (files.length === 0) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const dataUrls = files.map(file => {
      let contentType = "application/octet-stream";
      const fileExt = file.filename.split(".").pop().toLowerCase();
      if (fileExt === "png") {
        contentType = "image/png";
      } else if (fileExt === "jpg" || fileExt === "jpeg") {
        contentType = "image/jpeg";
      } else if (fileExt === "gif") {
        contentType = "image/gif";
      }

      const base64Image = file.content;
      return `data:${contentType};base64,${base64Image}`;
    })
    
    res.json({ success: true, data: dataUrls });
  } catch (error) {
    console.error("Get file from MongoDB is error:", error);
    res.status(500).json({ success: false, error: "kesalahan server internal" });
  }
});

router.get("/viewimg", isAuthenticated, async (req, res) => {
  res.render("viewimg");
});

router.get("/cycle", isAuthenticated, async (req, res) => {
  res.render("cycle");
});

router.get("/allmydaily", isAuthenticated, async (req, res) => {
  res.render("allmydaily");
})

module.exports = router;
