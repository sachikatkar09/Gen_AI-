import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../features/auth/hooks/useAuth";
import '../styles/aiInterview.scss';

const AIInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Step 1: Setup State
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [numQuestions, setNumQuestions] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [isGeneratingSelfIntro, setIsGeneratingSelfIntro] = useState(false);
  const [errors, setErrors] = useState({});
   
  // Step 2: Interview State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
   
  // Step 3: Voice Answer State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
   
  // Step 4: AI Evaluation State
  const [scores, setScores] = useState({
    communication: 0,
    technicalAccuracy: 0,
    confidence: 0,
    completeness: 0,
  });
  const [feedback, setFeedback] = useState({
    strengths: [],
    improvements: [],
  });
  const [idealAnswer, setIdealAnswer] = useState('');
   
  // Step 5: Final Report State
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [interviewSummary, setInterviewSummary] = useState({
    overallScore: 0,
    technicalScore: 0,
    communicationScore: 0,
    confidenceScore: 0,
    strengths: [],
    weaknesses: [],
    missingSkills: [],
    recommendedTopics: [],
    interviewSummary: '',
  });
  
  // Step 6: Interview History
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Refs
  const interviewContainerRef = useRef(null);

  // Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!resumeText.trim()) newErrors.resume = "Resume is required";
    if (!jobDescription.trim()) newErrors.jobDescription = "Job Description is required";
    if (!jobRole) newErrors.jobRole = "Job Role is required";
    if (!experienceLevel) newErrors.experienceLevel = "Experience Level is required";
    if (!difficulty) newErrors.difficulty = "Difficulty is required";
    if (!interviewType) newErrors.interviewType = "Interview Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle resume upload and extract text
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      setResume(file);
      await extractTextFromFile(file);
    } else {
      alert('Please upload a valid PDF or DOCX file.');
    }
  };

  // Extract text from PDF or DOCX file
  const extractTextFromFile = async (file) => {
    // In a real app, use a library like pdf-parse or mammoth for DOCX
    // For now, simulate extraction with a placeholder
    setResumeText(`Extracted text from ${file.name}. This would contain the parsed resume content in a real application.`);
  };
  
  // Handle drag and drop for resume
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      setResume(file);
      await extractTextFromFile(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Generate AI questions
  const generateQuestions = async () => {
    if (!validate()) return;
    
    setIsGenerating(true);
    setErrors({});
    
    try {
      const response = await fetch('http://localhost:5000/api/ai/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          selfIntroduction,
          difficulty,
          interviewType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }
      
      const data = await response.json();
      
      // Transform the structured questions into the expected format
      const formattedQuestions = [];
      let id = 1;
      
      Object.entries(data).forEach(([category, questions]) => {
        questions.forEach(question => {
          formattedQuestions.push({
            id: id++,
            text: question,
            type: category
          });
        });
      });
      
      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setProgress(0);
      setInterviewCompleted(false);
      
      // Scroll to interview section
      setTimeout(() => {
        interviewContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate interview questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate self-introduction
  const generateSelfIntroduction = async () => {
    if (!resumeText.trim()) {
      alert('Please upload a resume first.');
      return;
    }
    
    setIsGeneratingSelfIntro(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/ai/self-introduction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate self-introduction');
      }
      
      const data = await response.json();
      setSelfIntroduction(data.selfIntroduction);
      
    } catch (error) {
      console.error("Error generating self-introduction:", error);
      alert("Failed to generate self-introduction. Please try again.");
    } finally {
      setIsGeneratingSelfIntro(false);
    }
  };
  
  // Update progress steps based on current state
  const getProgressStepClass = (step) => {
    if (questions.length > 0 || interviewCompleted) {
      return 'completed';
    }
    if (step === 1 && !questions.length && !interviewCompleted) return 'active';
    if (step === 2 && jobDescription.trim()) return 'active';
    return '';
  };
  
  // Helper function to generate question text based on inputs
  const generateQuestionText = (index) => {
    const questionTypes = [
      `Explain a technical concept related to ${jobRole} that would be relevant for this position based on the job description.`,
      `Describe a project from your resume that demonstrates your skills in ${jobRole}. What challenges did you face and how did you overcome them?`,
      `Given your experience level as ${experienceLevel}, how would you approach a ${getDifficultyAdjective()} problem in ${jobRole}?`,
      `The job description mentions ${extractKeyRequirement()}. Can you provide an example of how you've handled this in your previous work?`,
      `Walk us through your thought process for solving a complex ${jobRole} problem.`,
      `How would you explain ${getTechnicalConcept()} to a non-technical stakeholder?`,
      `Describe a time when you had to learn a new technology quickly for a ${jobRole} project.`,
      `What testing strategies would you use for a ${jobRole} application based on your experience?`,
      `How do you stay updated with the latest trends and technologies in ${jobRole}?`,
      `Describe a situation where you had to debug a difficult issue in a ${jobRole} project.`
    ];
    
    return questionTypes[index % questionTypes.length] || `Question ${index}: ${jobRole} related question based on your resume and job description.`;
  };
  
  // Helper functions for question generation
  const getQuestionType = (index) => {
    const types = ['technical', 'project', 'behavioral', 'scenario', 'problem-solving'];
    return types[index % types.length];
  };
  
  const getDifficultyAdjective = () => {
    switch(difficulty) {
      case 'easy': return 'basic';
      case 'medium': return 'moderate';
      case 'hard': return 'challenging';
      default: return 'moderate';
    }
  };
  
  const extractKeyRequirement = () => {
    // Simple extraction of key phrases from job description
    const phrases = [
      'team collaboration', 'problem-solving', 'leadership', 'technical skills',
      'project management', 'communication', 'innovation', 'scalability'
    ];
    
    for (const phrase of phrases) {
      if (jobDescription.toLowerCase().includes(phrase)) {
        return phrase;
      }
    }
    
    return 'key requirements';
  };
  
  const getTechnicalConcept = () => {
    const concepts = [
      'microservices architecture', 'react hooks', 'database optimization',
      'machine learning models', 'cloud computing', 'RESTful APIs',
      'state management', 'CI/CD pipelines'
    ];
    return concepts[Math.floor(Math.random() * concepts.length)];
  };
  
  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real app, you would send this to a speech-to-text API
        // For now, we'll simulate transcription
        simulateTranscription();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Microphone access error:", err);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };
  
  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
    }
  };
  
  // Simulate transcription (replace with actual API call in production)
  const simulateTranscription = () => {
    setTimeout(() => {
      setTranscript("This is a mock transcribed answer based on your voice recording. In a real application, this would be converted from your speech using a speech recognition API.");
    }, 1000);
  };
  
  // Evaluate the answer
  const evaluateAnswer = () => {
    // Simulate AI evaluation
    const mockScores = {
      communication: Math.floor(Math.random() * 4) + 7, // 7-10
      technicalAccuracy: Math.floor(Math.random() * 4) + 7, // 7-10
      confidence: Math.floor(Math.random() * 4) + 7, // 7-10
      completeness: Math.floor(Math.random() * 4) + 7, // 7-10
    };
    
    setScores(mockScores);
    
    // Generate mock feedback
    const mockFeedback = {
      strengths: [
        "Clear communication of technical concepts",
        "Good examples from your experience",
        "Demonstrated problem-solving skills"
      ],
      improvements: [
        "Provide more specific metrics when describing achievements",
        "Work on explaining concepts more concisely",
        "Include more details about technologies used"
      ],
    };
    
    setFeedback(mockFeedback);
    
    // Generate mock ideal answer
    setIdealAnswer(
      `An ideal answer for this question would include:
      1. A clear explanation of the concept/approach
      2. Specific examples from your experience
      3. Relevant technologies or tools you've used
      4. Quantifiable results or outcomes if applicable
      5. How this relates to the job requirements
      
      For ${jobRole} positions at this level, interviewers look for depth of knowledge, practical experience, and the ability to communicate complex ideas clearly.`
    );
  };
  
  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setProgress(((currentQuestionIndex + 2) / questions.length) * 100);
      setTranscript('');
      setScores({});
      setFeedback({ strengths: [], improvements: [] });
      setIdealAnswer('');
    } else {
      // Interview completed
      completeInterview();
    }
  };
  
  // Navigate to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setProgress(((currentQuestionIndex) / questions.length) * 100);
    }
  };
  
  // Skip question
  const skipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      completeInterview();
    }
  };
  
  // Complete interview and generate final report
  const completeInterview = () => {
    // Generate final report
    const finalReport = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      technicalScore: Math.floor(Math.random() * 30) + 70, // 70-100
      communicationScore: Math.floor(Math.random() * 30) + 70, // 70-100
      confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-100
      strengths: [
        "Strong technical knowledge in key areas",
        "Good communication skills",
        "Relevant project experience"
      ],
      weaknesses: [
        "Could provide more specific metrics",
        "Some answers could be more concise",
        "Could demonstrate more leadership examples"
      ],
      missingSkills: ["Advanced cloud architecture", "Kubernetes administration", "Performance optimization"],
      recommendedTopics: [
        "Cloud computing best practices",
        "Advanced system design",
        "Leadership and team management"
      ],
      interviewSummary: `Based on your interview performance, you demonstrated strong ${jobRole} skills with a good understanding of key concepts. Your answers showed relevant experience and technical knowledge. To improve, focus on providing more specific examples with quantifiable results and work on explaining complex ideas more concisely.`
    };
    
    setInterviewSummary(finalReport);
    setInterviewCompleted(true);
    
    // Save to interview history
    saveInterviewToHistory(finalReport);
  };
  
  // Save interview to history
  const saveInterviewToHistory = (finalReport) => {
    const newInterview = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      jobRole,
      experienceLevel,
      difficulty,
      numQuestions,
      overallScore: finalReport.overallScore,
      technicalScore: finalReport.technicalScore,
      communicationScore: finalReport.communicationScore,
      confidenceScore: finalReport.confidenceScore,
      duration: `${Math.floor(questions.length * 2.5)} minutes`, // Estimate
      questions: questions.map(q => q.text),
      // In a real app, you would store answers and other details
    };
    
    // Update interview history
    const updatedHistory = [newInterview, ...interviewHistory].slice(0, 10); // Keep last 10
    setInterviewHistory(updatedHistory);
    
    // Save to localStorage
    if (user?.id) {
      localStorage.setItem(`interview_history_${user.id}`, JSON.stringify(updatedHistory));
    }
  };
  
  // Load interview history
  const loadInterviewHistory = () => {
    if (user?.id) {
      const savedHistory = localStorage.getItem(`interview_history_${user.id}`);
      if (savedHistory) {
        setInterviewHistory(JSON.parse(savedHistory));
      }
    }
  };
  
  // Reset interview
  const resetInterview = () => {
    setResume(null);
    setJobDescription('');
    setJobRole('');
    setExperienceLevel('');
    setDifficulty('');
    setNumQuestions(10);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setTranscript('');
    setScores({});
    setFeedback({ strengths: [], improvements: [] });
    setIdealAnswer('');
    setInterviewCompleted(false);
    setInterviewSummary({
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      recommendedTopics: [],
      interviewSummary: '',
    });
  };
  
  // Load interview history on component mount
  useEffect(() => {
    loadInterviewHistory();
  }, [user]);
  
  return (
    <div className="ai-interview-container">
      {/* Setup Section - Only shown when no questions are generated */}
      {!questions.length && !interviewCompleted && (
        <div className="interview-setup fade-in">
          <div className="interview-setup__header">
            <h1>AI Interview Preparation</h1>
            <p>Upload your resume and provide job details to generate a personalized interview simulation with AI-powered feedback</p>
          </div>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${getProgressStepClass(1)}`}>
              <div className="progress-step__icon">1</div>
              <div className="progress-step__label">Upload Resume</div>
            </div>
            <div className={`progress-step ${getProgressStepClass(2)}`}>
              <div className="progress-step__icon">2</div>
              <div className="progress-step__label">Add Job Description</div>
            </div>
            <div className={`progress-step ${getProgressStepClass(3)}`}>
              <div className="progress-step__icon">3</div>
              <div className="progress-step__label">AI Analysis</div>
            </div>
            <div className={`progress-step ${getProgressStepClass(4)}`}>
              <div className="progress-step__icon">4</div>
              <div className="progress-step__label">Interview Ready</div>
            </div>
          </div>
          
          <div className="interview-setup__form">
             {/* Resume Upload */}
             <div className="form-section">
               <div className="form-section__header">
                 <span className="form-section__icon">📄</span>
                 <h2>Resume</h2>
               </div>
              
                 {resume ? (
                   <div className="resume-uploaded glass-card">
                     <div className="resume-uploaded__details">
                       <div style={{ display: 'flex', alignItems: 'center', gap: '$spacing-xs' }}>
                         <span style={{ color: '$accent-pink' }}>✓</span>
                         <span className="resume-uploaded__name">Resume uploaded</span>
                       </div>
                       <span className="resume-uploaded__size">{resume.name}</span>
                     </div>
                     <div style={{ display: 'flex', gap: '$spacing-sm' }}>
                       <button className="btn btn-secondary" onClick={() => { setResume(null); setResumeText(''); }}>Replace</button>
                       <button className="btn btn-outline" onClick={() => { setResume(null); setResumeText(''); }}>Remove</button>
                     </div>
                   </div>
                 ) : (
                   <div className="resume-upload">
                     <label htmlFor="resume-upload" className="resume-upload__label">
                       <input
                         id="resume-upload"
                         type="file"
                         accept=".pdf,.docx,.doc"
                         onChange={handleResumeUpload}
                         style={{ display: "none" }}
                       />
                       <div className="resume-upload__area gradient-border compact"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}>
                         <div className="resume-upload__icon">📁</div>
                         <div className="resume-upload__title">Upload Resume</div>
                         <div className="resume-upload__subtitle">Drag & drop your PDF/DOCX resume or click to browse</div>
                         <div className="resume-upload__format">PDF or DOCX (Max 5MB)</div>
                       </div>
                     </label>
                   </div>
                 )}
               {errors.resume && <div className="error-message">{errors.resume}</div>}
             </div>
            
            {/* AI Analysis Card */}
            <div className="form-section">
              <div className="form-section__header">
                <span className="form-section__icon">🤖</span>
                <h2>What AI Will Analyze</h2>
              </div>
              <div className="ai-analysis-card glass-card">
                <div className="ai-analysis-card__items">
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>Resume Skills</span>
                  </div>
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>Projects</span>
                  </div>
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>Experience</span>
                  </div>
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>Technologies</span>
                  </div>
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>Job Description</span>
                  </div>
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>ATS Keywords</span>
                  </div>
                  <div className="ai-analysis-item">
                    <span className="ai-analysis-item__icon">✓</span>
                    <span>Difficulty Level</span>
                  </div>
                </div>
              </div>
            </div>
            
             {/* Job Description */}
             <div className="form-section">
               <div className="form-section__header">
                 <span className="form-section__icon">📝</span>
                 <h2>Job Description</h2>
               </div>
               <div className="form-group">
                 <textarea
                   className={`form-control textarea ${errors.jobDescription ? 'error' : ''}`}
                   value={jobDescription}
                   onChange={(e) => setJobDescription(e.target.value)}
                   placeholder="Paste the complete job description here to analyze requirements, skills, and keywords..."
                   rows={10}
                 />
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   {errors.jobDescription && <div className="error-message">{errors.jobDescription}</div>}
                   <div style={{ color: jobDescription.length > 2000 ? '#ef4444' : '$text-secondary', fontSize: '0.875rem' }}>
                     {jobDescription.length}/2000 characters
                   </div>
                 </div>
               </div>
             </div>

             {/* Self Introduction */}
             <div className="form-section">
               <div className="form-section__header">
                 <span className="form-section__icon">🎤</span>
                 <h2>Self Introduction</h2>
               </div>
               <div className="form-group">
                 <textarea
                   className="form-control textarea"
                   value={selfIntroduction}
                   onChange={(e) => setSelfIntroduction(e.target.value)}
                   placeholder="Enter your self-introduction or generate one using AI..."
                   rows={5}
                 />
                 <button
                   className="btn btn-secondary generate-intro-btn"
                   onClick={generateSelfIntroduction}
                   disabled={isGeneratingSelfIntro}
                 >
                   {isGeneratingSelfIntro ? 'Generating...' : '✨ Generate Self Introduction'}
                 </button>
               </div>
             </div>
            
            {/* Interview Settings */}
            <div className="form-section">
              <div className="form-section__header">
                <span className="form-section__icon">⚙️</span>
                <h2>Interview Settings</h2>
              </div>
              
              <div className="form-row">
                {/* Job Role */}
                <div className="form-group">
                  <label>Job Role *</label>
                  <select
                    className={`form-control ${errors.jobRole ? 'error' : ''}`}
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.jobRole && <div className="error-message">{errors.jobRole}</div>}
                </div>
                
                {/* Experience Level */}
                <div className="form-group">
                  <label>Experience Level *</label>
                  <select
                    className={`form-control ${errors.experienceLevel ? 'error' : ''}`}
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="">Select Experience</option>
                    <option value="Fresher/Entry Level">Fresher/Entry Level (0-1 year)</option>
                    <option value="Junior">Junior (1-3 years)</option>
                    <option value="Mid Level">Mid Level (3-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                    <option value="Lead">Lead/Manager (7+ years)</option>
                  </select>
                  {errors.experienceLevel && <div className="error-message">{errors.experienceLevel}</div>}
                </div>
              </div>
              
               <div className="form-row">
                 {/* Difficulty */}
                 <div className="form-group">
                   <label>Difficulty *</label>
                   <select
                     className={`form-control ${errors.difficulty ? 'error' : ''}`}
                     value={difficulty}
                     onChange={(e) => setDifficulty(e.target.value)}
                   >
                     <option value="">Select Difficulty</option>
                     <option value="easy">Easy</option>
                     <option value="medium">Medium</option>
                     <option value="hard">Hard</option>
                   </select>
                   {errors.difficulty && <div className="error-message">{errors.difficulty}</div>}
                 </div>
                 
                 {/* Interview Type */}
                 <div className="form-group">
                   <label>Interview Type *</label>
                   <select
                     className={`form-control ${errors.interviewType ? 'error' : ''}`}
                     value={interviewType}
                     onChange={(e) => setInterviewType(e.target.value)}
                   >
                     <option value="">Select Interview Type</option>
                     <option value="Technical">Technical</option>
                     <option value="Behavioral">Behavioral</option>
                     <option value="Full Stack">Full Stack</option>
                     <option value="System Design">System Design</option>
                     <option value="Coding">Coding</option>
                   </select>
                   {errors.interviewType && <div className="error-message">{errors.interviewType}</div>}
                 </div>
               </div>
            </div>
            
               {/* Generate Button */}
             <div className="form-actions">
               <button
                 className={`btn btn-primary generate-btn ${isGenerating ? 'loading' : ''}`}
                 onClick={generateQuestions}
                 disabled={isGenerating}
               >
                 {isGenerating ? 'Generating...' : 'Generate AI Interview Questions'}
               </button>
             </div>
          </div>
        </div>
      )}
      
      {/* Interview Section - Shown when questions are generated */}
      {questions.length > 0 && !interviewCompleted && (
        <div className="interview-section fade-in" ref={interviewContainerRef}>
          {/* Progress Bar */}
          <div className="interview-progress">
            <div className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          
               {/* Question Card */}
           <div className="question-card">
             <div className="question-header">
               <span className="question-category">{questions[currentQuestionIndex]?.type}</span>
               <span className="question-difficulty">{difficulty}</span>
             </div>
             <div className="question-text">
               {questions[currentQuestionIndex]?.text || "Loading question..."}
             </div>
              
             {/* Answer Section */}
             <div className="answer-section">
               <div className="answer-methods">
                 {!isRecording ? (
                   <button className="btn btn-primary" onClick={startRecording}>
                     <span>🎤</span> Start Speaking
                   </button>
                 ) : (
                   <button className="btn btn-danger" onClick={stopRecording}>
                     <span>⏹️</span> Stop ({recordingTime}s)
                   </button>
                 )}
                 <button className="btn btn-secondary" onClick={() => {}}>
                   <span>⌨️</span> Type Answer
                 </button>
               </div>
                
               {/* Transcript Display */}
               {transcript && (
                 <div className="transcript-box">
                   <h4>Your Answer:</h4>
                   <div className="transcript-text">{transcript}</div>
                 </div>
               )}
             </div>
              
             {/* Navigation Buttons */}
             <div className="interview-navigation">
               {currentQuestionIndex > 0 && (
                 <button className="btn btn-secondary" onClick={previousQuestion}>
                   Previous
                 </button>
               )}
                
               {Object.keys(scores).length === 0 ? (
                 <button className="btn btn-primary" onClick={evaluateAnswer}>
                   Evaluate Answer
                 </button>
               ) : (
                 <button className="btn btn-primary" onClick={nextQuestion}>
                   {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                 </button>
               )}
                
               <button className="btn btn-outline" onClick={skipQuestion}>
                 Skip
               </button>
             </div>
           </div>
          
          {/* AI Evaluation - Shown after evaluation */}
          {Object.keys(scores).length > 0 && (
            <div className="evaluation-section">
              <div className="evaluation-header">
                <h3>AI Evaluation</h3>
              </div>
              
              {/* Scores */}
              <div className="scores-grid">
                <div className="score-card">
                  <div className="score-label">Communication</div>
                  <div className="score-value">{scores.communication}/10</div>
                </div>
                <div className="score-card">
                  <div className="score-label">Technical Accuracy</div>
                  <div className="score-value">{scores.technicalAccuracy}/10</div>
                </div>
                <div className="score-card">
                  <div className="score-label">Confidence</div>
                  <div className="score-value">{scores.confidence}/10</div>
                </div>
                <div className="score-card">
                  <div className="score-label">Completeness</div>
                  <div className="score-value">{scores.completeness}/10</div>
                </div>
              </div>
              
              {/* Feedback */}
              <div className="feedback-grid">
                <div className="feedback-card">
                  <h4>Strengths</h4>
                  <ul>
                    {feedback.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="feedback-card">
                  <h4>Areas for Improvement</h4>
                  <ul>
                    {feedback.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Ideal Answer */}
              <div className="ideal-answer-card">
                <h4>AI Recommended Answer</h4>
                <div className="ideal-answer-text">{idealAnswer}</div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Final Report - Shown when interview is completed */}
      {interviewCompleted && (
        <div className="final-report fade-in">
          <div className="final-report__header">
            <h1>Interview Complete!</h1>
            <p>Here's your personalized performance analysis</p>
          </div>
          
          {/* Overall Score */}
          <div className="final-score">
            <div className="score-circle">
              <div className="score-value">{interviewSummary.overallScore}</div>
              <div className="score-label">Overall Score</div>
            </div>
          </div>
          
          {/* Detailed Scores */}
          <div className="score-details">
            <div className="score-card">
              <div className="score-label">Technical Score</div>
              <div className="score-value">{interviewSummary.technicalScore}</div>
            </div>
            <div className="score-card">
              <div className="score-label">Communication</div>
              <div className="score-value">{interviewSummary.communicationScore}</div>
            </div>
            <div className="score-card">
              <div className="score-label">Confidence</div>
              <div className="score-value">{interviewSummary.confidenceScore}</div>
            </div>
          </div>
          
          {/* Analysis Cards */}
          <div className="analysis-grid">
            {/* Strengths */}
            <div className="analysis-card">
              <div className="analysis-card__header">
                <span>💪</span>
                <h3>Strengths</h3>
              </div>
              <ul>
                {interviewSummary.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
            
            {/* Weaknesses */}
            <div className="analysis-card">
              <div className="analysis-card__header">
                <span>🔧</span>
                <h3>Areas for Improvement</h3>
              </div>
              <ul>
                {interviewSummary.weaknesses.map((weakness, i) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>
            
            {/* Missing Skills */}
            <div className="analysis-card">
              <div className="analysis-card__header">
                <span>🎯</span>
                <h3>Missing Skills</h3>
              </div>
              <ul>
                {interviewSummary.missingSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
            
            {/* Recommended Topics */}
            <div className="analysis-card">
              <div className="analysis-card__header">
                <span>📚</span>
                <h3>Recommended Topics</h3>
              </div>
              <ul>
                {interviewSummary.recommendedTopics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Interview Summary */}
          <div className="summary-card">
            <div className="summary-card__header">
              <span>📋</span>
              <h3>Interview Summary</h3>
            </div>
            <div className="summary-text">
              {interviewSummary.interviewSummary}
            </div>
          </div>
          
          {/* Actions */}
          <div className="final-actions">
            <button className="btn btn-primary" onClick={() => {}}>
              <span>📥</span> Download Report
            </button>
            <button className="btn btn-secondary" onClick={resetInterview}>
              <span>🔄</span> New Interview
            </button>
            <button className="btn btn-outline" onClick={() => setShowHistory(!showHistory)}>
              <span>📊</span> View History
            </button>
          </div>
          
          {/* Interview History */}
          {showHistory && (
            <div className="interview-history">
              <div className="interview-history__header">
                <h3>Your Interview History</h3>
              </div>
              {interviewHistory.length > 0 ? (
                <div className="history-table">
                  <div className="history-table__header">
                    <div>Date</div>
                    <div>Role</div>
                    <div>Score</div>
                    <div>Duration</div>
                    <div>Actions</div>
                  </div>
                  {interviewHistory.map((interview) => (
                    <div className="history-table__row" key={interview.id}>
                      <div>{new Date(interview.date).toLocaleDateString()}</div>
                      <div>{interview.jobRole}</div>
                      <div>{interview.overallScore}</div>
                      <div>{interview.duration}</div>
                      <div>
                        <button className="btn btn-small btn-outline">View</button>
                        <button className="btn btn-small btn-outline">Retry</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="history-empty">
                  <p>No previous interviews found.</p>
                  <p>Complete an interview to see your history here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInterview;