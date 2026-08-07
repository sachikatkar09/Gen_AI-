'use strict';

/**
 * Builds a prompt for generating interview questions based on resume, job description, and other inputs.
 * @param {string} resumeText - The text content of the resume.
 * @param {string} jobDescription - The job description text.
 * @param {string} selfIntroduction - The self-introduction text.
 * @param {string} difficulty - The difficulty level (Easy, Medium, Hard).
 * @param {string} interviewType - The type of interview (e.g., Technical, Behavioral).
 * @returns {string} - The structured prompt for Gemini AI.
 */
const buildInterviewQuestionsPrompt = (resumeText, jobDescription, selfIntroduction, difficulty, interviewType) => {
    return `
You are an expert interview preparation assistant. Generate 20 personalized interview questions based on the following details:

**Resume:**
${resumeText}

**Job Description:**
${jobDescription}

**Self Introduction:**
${selfIntroduction}

**Difficulty:** ${difficulty}
**Interview Type:** ${interviewType}

Instructions:
1. Analyze the resume, job description, and self-introduction to identify key skills, experiences, projects, technologies, and education.
2. Generate 20 questions divided into the following categories:
   - Technical (5 questions)
   - Behavioral (5 questions)
   - Project (4 questions)
   - HR (3 questions)
   - Coding (3 questions)
3. Ensure questions are relevant to the difficulty level and interview type.
4. Return **only valid JSON** in the following format:
\[start of json\]
{
    "technical": ["question1", "question2", ...],
    "behavioral": ["question1", "question2", ...],
    "project": ["question1", "question2", ...],
    "hr": ["question1", "question2", ...],
    "coding": ["question1", "question2", ...]
}
\[end of json\]
`;
};

/**
 * Builds a prompt for generating a self-introduction based on resume text.
 * @param {string} resumeText - The text content of the resume.
 * @returns {string} - The structured prompt for Gemini AI.
 */
const buildSelfIntroductionPrompt = (resumeText) => {
    return `
You are an expert career coach. Generate a professional self-introduction (1-2 minutes) based on the following resume:

**Resume:**
${resumeText}

Instructions:
1. Analyze the resume to identify key skills, experiences, and achievements.
2. Generate a concise and engaging self-introduction (150-200 words).
3. Return **only valid JSON** in the following format:
\[start of json\]
{
    "selfIntroduction": "..."
}
\[end of json\]
`;
};

/**
 * Builds a prompt for analyzing a resume against a job description.
 * @param {string} resumeText - The text content of the resume.
 * @param {string} jobDescription - The job description text.
 * @returns {string} - The structured prompt for Gemini AI.
 */
const buildResumeAnalysisPrompt = (resumeText, jobDescription) => {
    return `
You are an expert resume reviewer. Analyze the following resume against the job description and provide structured feedback:

**Resume:**
${resumeText}

**Job Description:**
${jobDescription}

Instructions:
1. Identify strong skills, weak skills, and missing technologies.
2. Calculate an ATS score (0-100) based on keyword matching.
3. Provide a summary of the resume.
4. Suggest improvements for better alignment with the job description.
5. Return **only valid JSON** in the following format:
\[start of json\]
{
    "strongSkills": ["skill1", "skill2", ...],
    "weakSkills": ["skill1", "skill2", ...],
    "missingTechnologies": ["tech1", "tech2", ...],
    "atsScore": 85,
    "resumeSummary": "...",
    "improvementSuggestions": ["suggestion1", "suggestion2", ...]
}
\[end of json\]
`;
};

module.exports = {
    buildInterviewQuestionsPrompt,
    buildSelfIntroductionPrompt,
    buildResumeAnalysisPrompt,
};