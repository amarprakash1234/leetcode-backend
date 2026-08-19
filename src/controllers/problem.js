const {getLanguageIdByName, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {

    const {title, description, difficulty,
         tags, visibleTestCases, hiddenTestCases,
          startCode, referenceSolution, problemCreator
    } = req.body;

    try {
        for(const {language, completeCode} of referenceSolution) {
            // language_id, source_code, stdin, expected_output

            const language_id = getLanguageIdByName(language);

            // Creating batch submission.
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: language_id,
                stdin: testcase.input,
                expexted_output: testcase.output,
            }));

            const submitResult = await submitBatch(submissions);
            // console.log(submitResult);

            const resultToken = submitResult.map((val) => val.token); // Ek aaray jisme token rkhe hue h.
            // console.log(resultToken);

            const testResult = await submitToken(resultToken);
            
            for(const test of testResult) {
                if(test.status_id != 3) {
                    return res.status(400).send(`Error Occured in ${language} solution`);
                }
            }
        }

        // Now we can store it in our DB
        const problem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id,
        });
        res.status(201).send("Problem Saved Successfully");

    } catch(err) {
        res.status(400).send(`Error -> ${err.message}`);
    }

}

const updateProblem = async (req, res) => {
    const {id} = req.params;
    const {title, description, difficulty,
         tags, visibleTestCases, hiddenTestCases,
          startCode, referenceSolution, problemCreator
    } = req.body;

    try {
        if(!id) {
            return res.status(400).send("Missing ID");
        }
        const dsaProblem = await Problem.findById(id);
        if(!dsaProblem) {
            return res.status(404).send("ID doesn't exists");
        }

        for(const {language, completeCode} of referenceSolution) {
            // language_id, source_code, stdin, expected_output

            const language_id = getLanguageIdByName(language);

            // Creating batch submission.
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: language_id,
                stdin: testcase.input,
                expexted_output: testcase.output,
            }));

            const submitResult = await submitBatch(submissions);
            // console.log(submitResult);

            const resultToken = submitResult.map((val) => val.token); // Ek aaray jisme token rkhe hue h.
            // console.log(resultToken);

            const testResult = await submitToken(resultToken);
            
            for(const test of testResult) {
                if(test.status_id != 3) {
                    return res.status(400).send(`Error Occured in ${language} solution`);
                }
            }
        }

        const updatedProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators: true});
        
        res.status(200).send(updatedProblem);

    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

const deleteProblem = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id) {
            return res.status(400).send("ID is Missing");
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem) {
            return res.status(404).send("Problem doesn't exist");
        }
        res.status(200).send("Problem Deleted Successfully");

    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

const getProblemById = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id) {
            return res.status(400).send("ID is Missing");
        }
        const problem = await Problem.findById(id).select("_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution");
        if(!problem) {
            return res.status(404).send("Problem doesn't exist");
        }
        // Video ka v url wagera le aao

        const videos = await SolutionVideo.findOne({problemId: id});

        if(videos) {
            // Yha simply dekh lunga agar user paid h tbhi usko video bheju wrna nhi

            // Problem yha MongoDb ka document h to esme ham es trhh se value nhi patak sakte hai because problem schema ye mentioned nhi h.
            // problem.secureUrl = videos.secureUrl;
            // problem.thumbnailUrl = videos.thumbnailUrl;
            // problem.duration = videos.duration;

            const responseData = {
                ...problem.toObject(),
                secureUrl : videos.secureUrl,
                thumbnailUrl : videos.thumbnailUrl,
                duration : videos.duration,
            }
            return res.status(200).send(responseData);
        }

        res.status(200).send(problem);

    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

const getAllProblem = async (req, res) => {
    // const {page, limit} = req.query;
    try {
        // const problems = await Problem.find().skip((page-1)*limit).limit(limit);
        const problems = await Problem.find({}).select("_id title difficulty tags")
        if(problems.length==0) {
            return res.status(404).send("Problem doesn't exist");
        }
        res.status(200).send(problems);

    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

const solvedAllProblemByUser = async (req, res) => {
    try {
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id title difficulty tags"
        });

        res.status(200).send(user.problemSolved);
        
    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

const submittedProblem = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.pid;

        const submissions = await Submission.find({userId, problemId});
        if(submissions.length == 0) {
            return res.status(200).send("No Submission is persent");
        }
        return res.status(200).send(submissions);

    } catch(err) {
        return res.status(500).send(`Error -> ${err.message}`);
    }
}

module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblemByUser, submittedProblem};

