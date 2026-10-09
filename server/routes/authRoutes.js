const express = require("express");

const {
    registerUser,
    loginUser,
    getArtisans
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You can access this protected route",
        user: req.user
    });
});

router.get("/artisans", getArtisans);

module.exports = router;