'use strict';

const express = require('express');
const {
    generateInterviewQuestionsHandler,
    generateSelfIntroductionHandler,
    analyzeResumeHandler,
} = require('../controllers/aiController');

const router = express.Router();

// Generate interview questions
router.post('/interview', generateInterviewQuestionsHandler);

// Generate self-introduction
router.post('/self-introduction', generateSelfIntroductionHandler);

// Analyze resume
router.post('/resume-analysis', analyzeResumeHandler);

module.exports = router;