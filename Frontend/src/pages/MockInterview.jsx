import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/mockInterview.scss";

const MockInterview = () => {
  // State for setup phase
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [interviewDifficulty, setInterviewDifficulty] = useState("medium");
  const [interviewType, setInterviewType] = useState("technical");
  const [language, setLanguage] = useState("english");
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState("20 min");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for interview phase
  const [interviewState, setInterviewState] = useState("setup"); // setup, active, complete
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  
  // State for feedback
  const [feedback, setFeedback] = useState({
    communication: 0,
    technicalAccuracy: 0,
    confidence: 0,
    clarity: 0,
    keywordMatch: 0,
    overallScore: 0,
    suggestions: [],
    currentFeedback: null
  });
  
  // State for final report
  const [finalReport, setFinalReport] = useState({
    overallScore: 0,
    communicationScore: 0,
    technicalScore: 0,
    confidence: 0,
    weakAreas: [],
    strongAreas: [],
    recommendedTopics: [],
    improvementTips: []
  });
  
  const timerRef = useRef(null);
  const mockInterviewRef = useRef(null);
  
  // Handle resume upload
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeUploaded(true);
    }
  };
  
  // Handle resume drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setResumeUploaded(true);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Handle generate interview
  const handleGenerateInterview = () => {
    if (!jobDescription.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      // Generate mock questions
      const mockQuestions = [];
      for (let i = 1; i <= questionCount; i++) {
        mockQuestions.push({
          id: i,
          text: `Question ${i}: Can you explain your experience with ${interviewType === 'technical' ? 'React and TypeScript' : interviewType === 'behavioral' ? 'team collaboration' : 'project management'}?`,
          type: interviewType
        });
      }
      
      // Generate mock analysis
      const mockAnalysis = {
        resumeMatch: Math.floor(Math.random() * 40) + 60,
        skillsDetected: ["React", "TypeScript", "Node.js", "MongoDB", "AWS"],
        experienceLevel: "Mid Level",
        missingSkills: ["Docker", "Kubernetes"],
        interviewReadiness: Math.floor(Math.random() * 30) + 70
      };
      
      setQuestions(mockQuestions);
      setFeedback(prev => ({
        ...prev,
        overallScore: mockAnalysis.interviewReadiness
      }));
      
      setIsGenerating(false);
      setInterviewState("active");
      setCurrentQuestion(0);
      setTimeLeft(1200); // Reset timer
    }, 1500);
  };
  
  // Handle interview navigation
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
      
      // Generate mock feedback for previous question
      const mockFeedback = {
        communication: Math.floor(Math.random() * 30) + 70,
        technicalAccuracy: Math.floor(Math.random() * 30) + 70,
        confidence: Math.floor(Math.random() * 30) + 70,
        clarity: Math.floor(Math.random() * 30) + 70,
        keywordMatch: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          "Use more specific examples from your experience",
          "Mention quantifiable results when possible",
          "Practice speaking more concisely"
        ]
      };
      
      setFeedback(prev => ({
        ...prev,
        currentFeedback: mockFeedback
      }));
    } else {
      // Interview complete
      handleEndInterview();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSkipQuestion = () => {
    handleNextQuestion();
  };
  
  const handleEndInterview = () => {
    // Generate final report
    const mockFinalReport = {
      overallScore: Math.floor(Math.random() * 30) + 70,
      communicationScore: Math.floor(Math.random() * 30) + 70,
      technicalScore: Math.floor(Math.random() * 30) + 70,
      confidence: Math.floor(Math.random() * 30) + 70,
      weakAreas: ["Docker", "Kubernetes", "System Design"],
      strongAreas: ["React", "TypeScript", "Team Collaboration"],
      recommendedTopics: [
        "Docker and Containerization",
        "Kubernetes Basics",
        "System Design Fundamentals"
      ],
      improvementTips: [
        "Practice explaining technical concepts more clearly",
        "Work on speaking more confidently about your achievements",
        "Prepare specific examples for behavioral questions"
      ]
    };
    
    setFinalReport(mockFinalReport);
    setInterviewState("complete");
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      setVoiceStatus("Processing...");
      
      setTimeout(() => {
        setVoiceStatus("Transcribing...");
        setTimeout(() => {
          setUserAnswer("This is my answer to the interview question using voice input.");
          setVoiceStatus("");
        }, 1000);
      }, 1000);
    } else {
      // Start listening
      setIsListening(true);
      setVoiceStatus("Listening...");
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (interviewState === "active" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleEndInterview();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewState, timeLeft]);
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = interviewState === "active" && questions.length > 0
    ? ((currentQuestion + 1) / questions.length) * 100
    : 0;
  
  // Scroll to top when interview state changes
  useEffect(() => {
    if (mockInterviewRef.current) {
      mockInterviewRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [interviewState, currentQuestion]);
  
  return (
    <div className="mock-interview-page">
      <div className="mock-interview-container" ref={mockInterviewRef}>
        {/* Header */}
        <header className="mock-interview-header">
          <div>
            <h1 className="mock-interview-title">
              <span>🎤</span> AI Mock Interview
            </h1>
            <p className="mock-interview-subtitle">
              Practice personalized interview questions generated from your Resume and Job Description.
            </p>
          </div>
          <div className="mock-interview-controls">
            <select
              className="mock-interview-select"
              value={interviewDifficulty}
              onChange={(e) => setInterviewDifficulty(e.target.value)}
              disabled={interviewState !== "setup"}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              className="mock-interview-select"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              disabled={interviewState !== "setup"}
            >
              <option value="hr">HR Interview</option>
              <option value="technical">Technical Interview</option>
              <option value="behavioral">Behavioral Interview</option>
              <option value="mixed">Mixed Interview</option>
            </select>
          </div>
        </header>
        
        {/* Setup Phase */}
        <div className={interviewState === "setup" ? "mock-interview-setup" : "mock-interview-setup hidden"}>
          <div className="setup-card">
            <div className="setup-card__header">
              <span className="setup-card__icon">📄</span>
              <h2 className="setup-card__title">Resume</h2>
            </div>
            
            {resumeUploaded ? (
              <div className="resume-uploaded">
                <span className="resume-uploaded__icon">✅</span>
                <div className="resume-uploaded__details">
                  <div className="resume-uploaded__name">{resumeFile?.name || "resume.pdf"}</div>
                  <div className="resume-uploaded__size">{(resumeFile?.size / 1024).toFixed(1)} KB</div>
                </div>
                <button className="resume-uploaded__change" onClick={() => setResumeUploaded(false)}>
                  Change Resume
                </button>
              </div>
            ) : (
              <label className="resume-upload" htmlFor="resume-upload">
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  style={{ display: "none" }}
                />
                <div className="resume-upload__icon">📁</div>
                <div className="resume-upload__title">Upload Resume</div>
                <div className="resume-upload__subtitle">Drag & Drop your PDF resume here</div>
              </label>
            )}
            
            {!resumeUploaded && (
              <div
                className="resume-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="resume-upload__subtitle">PDF only</div>
              </div>
            )}
          </div>
          
          <div className="setup-card">
            <div className="setup-card__header">
              <span className="setup-card__icon">📝</span>
              <h2 className="setup-card__title">Job Description</h2>
            </div>
            
            <div className="job-description">
              <textarea
                className="job-description__textarea"
                placeholder="Paste the complete Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={interviewState !== "setup"}
              />
              <div className="char-counter">{jobDescription.length} / 5000 characters</div>
            </div>
          </div>
          
          <div className="settings-section">
            <div className="setup-card__header">
              <span className="setup-card__icon">⚙️</span>
              <h2 className="setup-card__title">Interview Settings</h2>
            </div>
            
            <div className="settings-grid">
              <div className="setting-card">
                <h3 className="setting-card__title">
                  <span>🌐</span> Language
                </h3>
                <select
                  className="mock-interview-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={interviewState !== "setup"}
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>
              
              <div className="setting-card">
                <h3 className="setting-card__title">
                  <span>📊</span> Question Count
                </h3>
                <select
                  className="mock-interview-select"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  disabled={interviewState !== "setup"}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              
              <div className="setting-card">
                <h3 className="setting-card__title">
                  <span>⏱️</span> Expected Duration
                </h3>
                <select
                  className="mock-interview-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={interviewState !== "setup"}
                >
                  <option value="5 min">5 min</option>
                  <option value="10 min">10 min</option>
                  <option value="20 min">20 min</option>
                  <option value="30 min">30 min</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* AI Analysis Card */}
          <div className="ai-analysis">
            <div className="ai-analysis__header">
              <span className="setup-card__icon">🤖</span>
              <h2 className="ai-analysis__title">AI Analysis</h2>
            </div>
            
            <div className="ai-analysis__grid">
              <div className="analysis-item">
                <div className="analysis-item__label">Resume Match</div>
                <div className="analysis-item__value">{feedback.overallScore}%</div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${feedback.overallScore}%` }}></div>
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-item__label">Skills Detected</div>
                <div className="analysis-item__value">
                  {feedback.skillsDetected?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                  {feedback.skillsDetected?.length > 3 && <span className="skill-badge">+{feedback.skillsDetected.length - 3}</span>}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-item__label">Experience Level</div>
                <div className="analysis-item__value">{feedback.experienceLevel || "Mid Level"}</div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-item__label">Missing Skills</div>
                <div className="analysis-item__value">
                  {feedback.missingSkills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                  {feedback.missingSkills?.length > 3 && <span className="skill-badge">+{feedback.missingSkills.length - 3}</span>}
                </div>
              </div>
              
              <div className="analysis-item">
                <div className="analysis-item__label">Interview Readiness</div>
                <div className="analysis-item__value">{feedback.overallScore}/100</div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${feedback.overallScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            className="generate-button"
            onClick={handleGenerateInterview}
            disabled={isGenerating || !jobDescription.trim()}
          >
            {isGenerating ? (
              <>
                <span className="button-spinner"></span>
                Generating...
              </>
            ) : (
              "Generate AI Interview"
            )}
          </button>
        </div>
        
        {/* Interview Workspace */}
        <div className={`interview-workspace ${interviewState === "active" ? "interview-active" : ""}`}>
          <div className="interview-progress">
            <div className="progress-bar-large">
              <div className="progress-bar-large__fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          
          <div className="question-card">
            <div className="question-text">
              {questions[currentQuestion]?.text || "Loading question..."}
            </div>
            
            <div className="interview-actions">
              <button className="action-button action-button--primary" onClick={handleVoiceInput}>
                <span>🎤</span> Start Speaking
              </button>
              <button className="action-button action-button--secondary" onClick={() => {}}>
                <span>⌨</span> Type Answer
              </button>
              <button className="action-button action-button--secondary" onClick={handleSkipQuestion}>
                Skip
              </button>
            </div>
          </div>
          
          <div className="interview-actions">
            {currentQuestion > 0 && (
              <button className="action-button action-button--secondary" onClick={handlePreviousQuestion}>
                Previous
              </button>
            )}
            <button className="action-button action-button--primary" onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? "Next" : "End Interview"}
            </button>
          </div>
        </div>
        
        {/* Final Report */}
        <div className={`final-report ${interviewState === "complete" ? "interview-complete" : ""}`}>
          <div className="report-header">
            <h2 className="report-title">Interview Complete!</h2>
            <p className="report-subtitle">Here's your personalized feedback and performance analysis.</p>
          </div>
          
          <div className="report-score">
            <div className="score-circle" style={{ "--score-percent": `${finalReport.overallScore}%` }}>
              <div className="score-value">{finalReport.overallScore}</div>
            </div>
            <div className="score-label">Overall Score</div>
          </div>
          
          <div className="report-grid">
            <div className="report-card">
              <h3 className="report-card__title">
                <span>📊</span> Communication Score
              </h3>
              <div className="analysis-item__value">{finalReport.communicationScore}/100</div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${finalReport.communicationScore}%` }}></div>
              </div>
            </div>
            
            <div className="report-card">
              <h3 className="report-card__title">
                <span>💡</span> Technical Score
              </h3>
              <div className="analysis-item__value">{finalReport.technicalScore}/100</div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${finalReport.technicalScore}%` }}></div>
              </div>
            </div>
            
            <div className="report-card">
              <h3 className="report-card__title">
                <span>🎯</span> Strong Areas
              </h3>
              <ul className="report-card__list">
                {finalReport.strongAreas?.map((area, index) => (
                  <li key={index} className="report-card__item">{area}</li>
                ))}
              </ul>
            </div>
            
            <div className="report-card">
              <h3 className="report-card__title">
                <span>🔧</span> Weak Areas
              </h3>
              <ul className="report-card__list">
                {finalReport.weakAreas?.map((area, index) => (
                  <li key={index} className="report-card__item">{area}</li>
                ))}
              </ul>
            </div>
            
            <div className="report-card">
              <h3 className="report-card__title">
                <span>📚</span> Recommended Topics
              </h3>
              <ul className="report-card__list">
                {finalReport.recommendedTopics?.map((topic, index) => (
                  <li key={index} className="report-card__item">{topic}</li>
                ))}
              </ul>
            </div>
            
            <div className="report-card">
              <h3 className="report-card__title">
                <span>💡</span> Improvement Tips
              </h3>
              <ul className="report-card__list">
                {finalReport.improvementTips?.map((tip, index) => (
                  <li key={index} className="report-card__item">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="report-actions">
            <button className="action-button action-button--secondary">
              <span>📥</span> Download Report
            </button>
            <button className="action-button action-button--primary" onClick={() => setInterviewState("setup")}>
              <span>🔄</span> Retake Interview
            </button>
            <Link to="/dashboard" className="action-button action-button--secondary">
              <span>🏠</span> Go to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Empty State */}
        <div className={`empty-state ${interviewState === "setup" && !isGenerating && !jobDescription.trim() ? "" : "hidden"}`}>
          <div className="empty-illustration">🎯</div>
          <h3 className="empty-title">Generate your personalized AI interview</h3>
          <p className="empty-subtitle">
            Upload your resume and paste the job description to get started with AI-powered mock interviews.
          </p>
        </div>
        
        {/* Voice UI Elements */}
        {interviewState === "active" && (
          <>
            <button
              className="voice-button"
              onClick={handleVoiceInput}
              disabled={isListening}
            >
              🎤
            </button>
            {voiceStatus && (
              <div className="voice-status">
                {voiceStatus}
              </div>
            )}
          </>
        )}
        
        {/* Feedback Panel */}
        {interviewState === "active" && feedback.currentFeedback && (
          <div className="feedback-panel">
            <div className="feedback-header">
              <span>📊</span>
              <h3 className="feedback-title">AI Feedback</h3>
            </div>
            
            <div className="feedback-section">
              <h4 className="feedback-section__title">
                <span>💬</span> Communication
              </h4>
              <div className="feedback-item">
                <div className="feedback-item__label">
                  <span>Score</span>
                  <span className="feedback-score">{feedback.currentFeedback.communication}/100</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${feedback.currentFeedback.communication}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="feedback-section">
              <h4 className="feedback-section__title">
                <span>💡</span> Technical Accuracy
              </h4>
              <div className="feedback-item">
                <div className="feedback-item__label">
                  <span>Score</span>
                  <span className="feedback-score">{feedback.currentFeedback.technicalAccuracy}/100</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${feedback.currentFeedback.technicalAccuracy}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="feedback-section">
              <h4 className="feedback-section__title">
                <span>😊</span> Confidence
              </h4>
              <div className="feedback-item">
                <div className="feedback-item__label">
                  <span>Score</span>
                  <span className="feedback-score">{feedback.currentFeedback.confidence}/100</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${feedback.currentFeedback.confidence}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="feedback-section">
              <h4 className="feedback-section__title">
                <span>🎯</span> Keyword Match
              </h4>
              <div className="feedback-item">
                <div className="feedback-item__label">
                  <span>Score</span>
                  <span className="feedback-score">{feedback.currentFeedback.keywordMatch}/100</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${feedback.currentFeedback.keywordMatch}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="feedback-section">
              <h4 className="feedback-section__title">
                <span>💡</span> Suggestions
              </h4>
              {feedback.currentFeedback.suggestions?.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Timer Display */}
        {interviewState === "active" && (
          <div className="timer-display">
            ⏱️ {formatTime(timeLeft)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;