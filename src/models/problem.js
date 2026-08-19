const mongoose = require("mongoose");
const {Schema} = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    tags: {
        type: String,
        enum: ["array", "string", "recursion", "conditionals","2d array", "function"],
        required: true,
    },
    visibleTestCases: [
        {
            _id: false,
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            explanation: {
                type: String,
                required: true,
            }
        }
    ],
    hiddenTestCases: [
        {
            _id: false,
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
        }
    ],
    startCode: [
        {
            _id: false,
            language: {
                type: String,
                required: true,
            },
            initialCode: {
                type: String,
                required: true,
            },
        }
    ],
    referenceSolution: [
        {
            _id: false,
            language: {
                type: String,
                required: true,
            },
            completeCode: {
                type: String,
                required: true,
            },
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true});

problemSchema.post("findOneAndDelete", async function(deletedProblem) {
    if(deletedProblem) {
        await mongoose.model("Submission").deleteMany({problemId: deletedProblem._id});
    }
})

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;