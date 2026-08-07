'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
    buildInterviewQuestionsPrompt,
    buildSelfIntroductionPrompt,
    buildResumeAnalysisPrompt,
} = require('../utils/promptBuilder');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generates interview questions using Gemini AI.
 * @param {string} resumeText - The text content of the resume.
 * @param {string} jobDescription - The job description text.
 * @param {string} selfIntroduction - The self-introduction text.
 * @param {string} difficulty - The difficulty level (Easy, Medium, Hard).
 * @param {string} interviewType - The type of interview (e.g., Technical, Behavioral).
 * @returns {Promise<Object>} - The generated questions in structured JSON format.
 */
const generateInterviewQuestions = async (resumeText, jobDescription, selfIntroduction, difficulty, interviewType) => {
    const prompt = buildInterviewQuestionsPrompt(resumeText, jobDescription, selfIntroduction, difficulty, interviewType);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
};

/**
 * Generates a self-introduction using Gemini AI.
 * @param {string} resumeText - The text content of the resume.
 * @returns {Promise<Object>} - The generated self-introduction in structured JSON format.
 */
const generateSelfIntroduction = async (resumeText) => {
    const prompt = buildSelfIntroductionPrompt(resumeText);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
};

/**
 * Analyzes a resume using Gemini AI.
 * @param {string} resumeText - The text content of the resume.
 * @param {string} jobDescription - The job description text.
 * @returns {Promise<Object>} - The resume analysis in structured JSON format.
 */
const analyzeResume = async (resumeText, jobDescription) => {
    const prompt = buildResumeAnalysisPrompt(resumeText, jobDescription);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
};

module.exports = {
    generateInterviewQuestions,
    generateSelfIntroduction,
    analyzeResume,
};