const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;

    if (!PostId) {
        return res.status(400).json({ error: "PostId is required" });
    }

    try {
        const found = await Likes.findOne({
            where: { PostId: PostId, UserId: UserId },
        });
        if (!found) {
            await Likes.create({ PostId: PostId, UserId: UserId });
            res.json({ liked: true });
        } else {
            await Likes.destroy({
                where: { PostId: PostId, UserId: UserId },
            });
            res.json({ liked: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});


module.exports = router;