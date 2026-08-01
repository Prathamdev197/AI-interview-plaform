const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        }
    }],
    answers: [{
        questionIndex: Number,
        questionText: String,
        userAnswer: String,
        score: Number,
        feedback: String,
        idealAnswer: String
    }],
    overallScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;
