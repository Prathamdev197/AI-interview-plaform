const express = require('express');
const router = express.Router();
const { 
    startInterview, 
    submitAnswer, 
    getUserInterviews, 
    getInterviewById,
    deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware');

router.post('/start', protect, startInterview);
router.post('/:id/answer', protect, submitAnswer);
router.get('/', protect, getUserInterviews);
router.get('/:id', protect, getInterviewById);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
