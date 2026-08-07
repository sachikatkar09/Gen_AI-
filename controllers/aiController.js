'use strict';

const {
    generateInterviewQuestions,
    generateSelfIntroduction,
    analyzeResume,
} = require('../services/geminiService');

/**
 * Generates interview questions based on resume, job description, and other inputs.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const generateInterviewQuestionsHandler = async (req, res) => {
    try {
        const { resumeText, jobDescription, selfIntroduction, difficulty, interviewType } = req.body;
        
        if (!resumeText || !jobDescription || !selfIntroduction || !difficulty || !interviewType) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        
        const questions = await generateInterviewQuestions(resumeText, jobDescription, selfIntroduction, difficulty, interviewType);
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({ error: 'Failed to generate interview questions.' });
    }
};

/**
 * Generates a self-introduction based on resume text.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const generateSelfIntroductionHandler = async (req, res) => {
    try {
        const { resumeText } = req.body;
        
        if (!resumeText) {
            return res.status(400).json({ error: 'Resume text is required.' });
        }
        
        const selfIntroduction = await generateSelfIntroduction(resumeText);
        res.status(200).json(selfIntroduction);
    } catch (error) {
        console.error('Error generating self-introduction:', error);
        res.status(500).json({ error: 'Failed to generate self-introduction.' });
    }
};

/**
 * Analyzes a resume against a job description.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const analyzeResumeHandler = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Resume text and job description are required.' });
        }
        
        const analysis = await analyzeResume(resumeText, jobDescription);
        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'Failed to analyze resume.' });
    }
};

module.exports = {
    generateInterviewQuestionsHandler,
    generateSelfIntroductionHandler,
    analyzeResumeHandler,
};