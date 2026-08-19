const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const userMiddleware = require("../middlewares/userMiddleware");
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblemByUser, submittedProblem} = require("../controllers/problem");


// Create -> Admin aceess chahiye hoga
problemRouter.post("/create", adminMiddleware, createProblem);
// Update -> Admin aceess chahiye hoga
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
// Delete -> Admin aceess chahiye hoga
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

// Fetch
problemRouter.get("/problembyid/:id", userMiddleware, getProblemById);
// Fetch all problem
problemRouter.get("/getallproblem", userMiddleware, getAllProblem);
// Fetch all problem which have been solved by particular user
problemRouter.get("/problemsolvedbyuser", userMiddleware, solvedAllProblemByUser);
// Fetch all submission of a particular problem of a particular user
problemRouter.get("/submittedproblem/:pid", userMiddleware, submittedProblem);

module.exports = problemRouter;
