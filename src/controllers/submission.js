const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {getLanguageIdByName, submitBatch, submitToken} = require("../utils/problemUtility");

const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        let {language, code} = req.body;

        if(!userId || !problemId || !code || !language) {
            res.status(400).send("Some field missing");
        }

        if(language === "cpp") 
            language = "c++"

        // Ab ham problem ko DB se fetch krenge becoz whi se hidden test cases milenge.
        const problem = await Problem.findById(problemId);

        // Apne submission ko store krenge DB ke ander before handling to Judge0.
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: "pending",
            testCasesTotal: problem.hiddenTestCases.length
        });

        // Ab judge0 ko subbmision wala code bhejna hai.
        const language_id = getLanguageIdByName(language);
        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: language_id,
            stdin: testcase.input,
            expexted_output: testcase.output,
        }));
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((val) => val.token);
        const testResult = await submitToken(resultToken);
        
        // Submitted Result ko update kro DB me
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMessage = null;
        for(const test of testResult) {
            if(test.status_id == 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                if(test.status_id == 4) {
                    status = "error";
                    errorMessage = test.stderr;
                } else {
                    status = "wrong";
                    errorMessage = test.stderr;
                }
            }
        }

        submission.status = status;
        submission.testCasesPassed = testCasesPassed;
        submission.runtime = runtime;
        submission.memory = memory;
        submission.errorMessage = errorMessage;

        await submission.save();

        // ProblemId ko insert krenge userSchema ke problemSolved field me if it is not persent there.
        if(!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        const accepted = (status == "accepted");
        res.status(201).json({
            accepted,
            totalTestCases: submission.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory,
            error: errorMessage
        });

    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }

}

const runCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        let {language, code} = req.body;

        if(!userId || !problemId || !code || !language) {
            res.status(400).send("Some field missing");
        }

        // Ab ham problem ko DB se fetch krenge becoz whi se hidden test cases milenge.
        const problem = await Problem.findById(problemId);

        // Ab judge0 ko subbmision wala code bhejna hai.
        const language_id = getLanguageIdByName(language);
        if(language === "cpp")
            language = "c++"
        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: language_id,
            stdin: testcase.input,
            expexted_output: testcase.output,
        }));
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((val) => val.token);
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;
        for(const test of testResult) {
            if(test.status_id == 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                if(test.status_id == 4) {
                    status = false;
                    errorMessage = test.stderr;
                } else {
                    status = false;
                    errorMessage = test.stderr;
                }
            }
        }

        res.status(200).json({
            success: status,
            testCases: testResult,
            runtime,
            memory,
            error: errorMessage
        });

    } catch(err) {
        res.status(500).send(`Error -> ${err.message}`);
    }
}

module.exports = {submitCode, runCode};