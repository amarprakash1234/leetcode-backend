const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require("../middlewares/userMiddleware");
const {submitCode, runCode} = require("../controllers/submission");


submitRouter.post("/submit/:id", userMiddleware, submitCode);

submitRouter.post("/run/:id", userMiddleware, runCode);

module.exports = submitRouter;