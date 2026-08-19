const express = require("express");
const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile} = require("../controllers/userAuth");
const userMiddleware = require("../middlewares/userMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Register for user
authRouter.post("/register", register);

// Register for Admin
authRouter.post("/admin/register", adminMiddleware, adminRegister);

// Login
authRouter.post("/login", login);

// Logout
authRouter.post("/logout", userMiddleware, logout);

// Delete Profile
authRouter.delete("/profile", userMiddleware, deleteProfile);

authRouter.get("/check", userMiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role: req.result.role,
    }

    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
})

// Get Profile
// authRouter.get("/getProfile", getProfile);

module.exports = authRouter;