const express = require("express");
const aiRouter = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const solveCodingDoubt = require("../controllers/solveDoubt");

aiRouter.post("/chat", userMiddleware, solveCodingDoubt);

module.exports = aiRouter;
