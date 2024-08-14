const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
        res.json("SUCCESS");
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) return res.json({ error: "User Doesn't Exist" });

    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) return res.json({ error: "Wrong Username And Password Combination" });

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );
      return  res.json({ token: accessToken, username: username, id: user.id });
    });
});

router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const basicInfo = await Users.findByPk(id, {
            attributes: { exclude: ["password"] } // Corrected attributes option
        });

        if (basicInfo) {
            res.json(basicInfo);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the user information" });
    }
});

router.put('/changepassword', validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await Users.findOne({ where: { username: req.user.username } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Wrong Password Entered" });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await Users.update({ password: hash }, { where: { username: req.user.username } });

        return res.json("SUCCESS");
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while changing the password" });
    }
});

module.exports = router;