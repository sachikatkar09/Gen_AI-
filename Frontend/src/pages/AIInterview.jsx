import { useState, useRef, useEffect } from 'react';
import '../styles/aiInterview.scss';

const AIInterview = () => {
  // Step 1: Upload Details
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 2: AI Questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Step 3: Voice Answer
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  // Step 4: AI Evaluation
  const [scores, setScores] = useState({
    communication: 0,
    technicalAccuracy: 0,
    confidence: 0,
    fluency: 0,
    grammar: 0,
    relevance: 0,
    completeness: 0,
  });

  // Step 5: AI Feedback
  const [feedback, setFeedback] = useState({
    strengths: [],
    improvements: [],
  });

  // Step 6: Ideal Answer
  const [idealAnswer, setIdealAnswer] = useState('');

  // Step 7: Final Result
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [interviewSummary, setInterviewSummary] = useState({
    overallScore: 0,
    confidence: 0,
    communication: 0,
    technicalSkills: 0,
    fluency: 0,
    atsReadiness: 0,
    suggestions: [],
  });
  const [interviewHistory, setInterviewHistory] = useState([]);

  // Handle Resume Upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setResume(file);
    } else {
      alert('Please upload a valid PDF or DOCX file.');
    }
  };

  // Generate AI Questions
  const generateQuestions = () => {
    if (!jobDescription || !jobRole || !experienceLevel || !difficulty) {
      alert('Please fill in all fields.');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const mockQuestions = Array(numQuestions).fill().map((_, i) => `
        Question ${i + 1}: ${jobRole} related question based on your resume and job description.
      `);
      setQuestions(mockQuestions);
      setIsGenerating(false);
    }, 2000);
  };

  // Start Recording
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
        const audioUrl = URL.createObjectURL(audioBlob);
        // Simulate transcription
        setTranscript("This is a mock transcribed answer based on your recording.");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
    }
  };

  // Evaluate Answer
  const evaluateAnswer = () => {
    // Simulate AI evaluation
    setScores({
      communication: Math.floor(Math.random() * 100),
      technicalAccuracy: Math.floor(Math.random() * 100),
      confidence: Math.floor(Math.random() * 100),
      fluency: Math.floor(Math.random() * 100),
      grammar: Math.floor(Math.random() * 100),
      relevance: Math.floor(Math.random() * 100),
      completeness: Math.floor(Math.random() * 100),
    });

    // Simulate AI feedback
    setFeedback({
      strengths: [
        "Clear communication of ideas.",
        "Good technical depth in answers.",
      ],
      improvements: [
        "Work on confidence while speaking.",
        "Improve grammar and fluency.",
      ],
    });

    // Simulate ideal answer
    setIdealAnswer(
      "This is the AI-recommended answer for the question based on industry best practices."
    );
  };

  // Next Question
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
      const summary = {
        overallScore: Math.floor(Math.random() * 100),
        confidence: Math.floor(Math.random() * 100),
        communication: Math.floor(Math.random() * 100),
        technicalSkills: Math.floor(Math.random() * 100),
        fluency: Math.floor(Math.random() * 100),
        atsReadiness: Math.floor(Math.random() * 100),
        suggestions: [
          "Practice more mock interviews.",
          "Improve technical knowledge in key areas.",
        ],
      };
      setInterviewSummary(summary);
      setInterviewCompleted(true);
    }
  };

  // Reset Interview
  const resetInterview = () => {
    setResume(null);
    setJobDescription('');
    setJobRole('');
    setExperienceLevel('');
    setDifficulty('');
    setNumQuestions(5);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setTranscript('');
    setScores({});
    setFeedback({ strengths: [], improvements: [] });
    setIdealAnswer('');
    setInterviewCompleted(false);
  };

  return (
     <div className="ai-interview-container">
       {/* Step 1: Upload Details */}
       {!questions.length && !interviewCompleted && (
           <div className="upload-details fade-in">
            <h1>AI Interview Setup</h1>
            <div className="form-group">
              <label>Upload Resume (PDF/DOCX)</label>
              <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} />
            </div>
            <div className="form-group">
              <label>Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Job Role</label>
                <select value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                  <option value="">Select Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2+ Years">2+ Years</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Questions</label>
                <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>
            <button className="generate-button" onClick={generateQuestions} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate AI Interview'}
            </button>
          </div>
        )}

        {/* Step 2: AI Questions */}
         {questions.length > 0 && !interviewCompleted && (
           <div className="ai-questions fade-in">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <h2>{questions[currentQuestionIndex]}</h2>

            {/* Step 3: Voice Answer */}
            <div className="voice-answer">
              <div className="recording-controls">
                {!isRecording ? (
                  <button className="record-button" onClick={startRecording}>
                    🎤 Record Answer
                  </button>
                ) : (
                  <button className="stop-button" onClick={stopRecording}>
                    ⏹️ Stop ({recordingTime}s)
                  </button>
                )}
              </div>
              {transcript && (
                <div className="transcript-box">
                  <h3>Your Answer:</h3>
                  <textarea value={transcript} readOnly />
                </div>
              )}
            </div>

            {/* Step 4: AI Evaluation */}
            {Object.keys(scores).length > 0 && (
              <div className="ai-evaluation">
                <h3>AI Evaluation</h3>
                <div className="scores-grid">
                  {Object.entries(scores).map(([key, value]) => (
                    <div key={key} className="score-card">
                      <h4>{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <div className="score-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: AI Feedback */}
            {feedback.strengths?.length > 0 && (
              <div className="ai-feedback">
                <div className="feedback-section">
                  <h3>What you did well</h3>
                  <ul>
                    {feedback.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="feedback-section">
                  <h3>Needs Improvement</h3>
                  <ul>
                    {feedback.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 6: Ideal Answer */}
            {idealAnswer && (
              <div className="ideal-answer">
                <h3>AI Recommended Answer</h3>
                <p>{idealAnswer}</p>
              </div>
            )}

            {/* Step 7: Next Question */}
            <div className="next-question">
              {Object.keys(scores).length === 0 ? (
                <button className="evaluate-button" onClick={evaluateAnswer}>
                  Evaluate Answer
                </button>
              ) : (
                <button className="next-button" onClick={nextQuestion}>
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Final Result Page */}
         {interviewCompleted && (
           <div className="final-result fade-in">
            <h1>Interview Summary</h1>
            <div className="summary-cards">
              <div className="summary-card">
                <h2>Overall Score</h2>
                <div className="circular-progress">
                  <span>{interviewSummary.overallScore}</span>
                </div>
              </div>
              {Object.entries(interviewSummary).map(([key, value]) => (
                key !== 'overallScore' && key !== 'suggestions' && (
                  <div key={key} className="summary-card">
                    <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <div className="score-value">{value}</div>
                  </div>
                )
              ))}
            </div>
            <div className="ai-suggestions">
              <h3>AI Suggestions</h3>
              <ul>
                {interviewSummary.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
            <div className="final-actions">
              <button className="download-button">Download Interview Report (PDF)</button>
              <button className="save-button">Save Interview History</button>
              <button className="retry-button" onClick={resetInterview}>Retry Interview</button>
            </div>
            <div className="interview-history">
              <h3>Previous Interviews</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Job Role</th>
                    <th>Score</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewHistory.map((interview, i) => (
                    <tr key={i}>
                      <td>{interview.date}</td>
                      <td>{interview.jobRole}</td>
                      <td>{interview.score}</td>
                      <td>{interview.duration}</td>
                      <td>
                        <button className="view-button">View Report</button>
                        <button className="retry-button">Retry</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default AIInterview;