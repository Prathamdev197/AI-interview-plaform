const Interview = require('../models/Interview');
const { generateInterviewQuestions, evaluateAnswer } = require('../services/geminiService');

// Start a new AI interview
const startInterview = async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        if (!topic || !difficulty) {
            return res.status(400).json({ message: 'Topic and difficulty are required' });
        }

        const questions = await generateInterviewQuestions(topic, difficulty, 10);

        const interview = await Interview.create({
            user: req.user._id,
            topic,
            difficulty,
            questions,
            answers: [],
            overallScore: 0
        });

        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit an answer for evaluation
const submitAnswer = async (req, res) => {
    try {
        const { questionIndex, userAnswer } = req.body;
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const question = interview.questions[questionIndex];
        if (!question) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        const evaluation = await evaluateAnswer(
            interview.topic,
            interview.difficulty,
            question.questionText,
            userAnswer || ''
        );

        const answerRecord = {
            questionIndex,
            questionText: question.questionText,
            userAnswer: userAnswer || '',
            score: evaluation.score,
            feedback: evaluation.feedback,
            idealAnswer: evaluation.idealAnswer
        };

        interview.answers.push(answerRecord);

        // Calculate average overall score
        const totalScore = interview.answers.reduce((sum, a) => sum + a.score, 0);
        interview.overallScore = Math.round((totalScore / interview.answers.length) * 10) / 10;

        await interview.save();

        res.json({
            evaluation: answerRecord,
            overallScore: interview.overallScore,
            answeredCount: interview.answers.length,
            totalQuestions: interview.questions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all past interviews for logged in user
const getUserInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single interview details by ID
const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete single interview record
const deleteInterview = async (req, res) => {
    try {
        await Interview.findByIdAndDelete(req.params.id);
        res.json({ message: 'Interview deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    startInterview,
    submitAnswer,
    getUserInterviews,
    getInterviewById,
    deleteInterview
};
