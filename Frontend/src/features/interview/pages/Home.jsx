import { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner"></div>
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10c0-4.42-3.58-8-8-8z" />
            <path d="M12 2a10 10 0 0 0-3.32 19.27" />
            <path d="M12 22a10 10 0 0 0 3.32-19.27" />
            <path d="M2 12h20" />
            <path d="M22 12a10 10 0 0 0-10-10" />
            <path d="M12 12a10 10 0 0 0-10 10" />
          </svg>
          AI Interview Preparation
        </h1>
        <p>
          Upload your resume and job description to generate personalized AI interview questions based on your profile.
        </p>
      </header>

      {/* Main Card */}
      <div className="interview-card">
        <div className="interview-card__body">
          {/* Left Panel - Job Description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => {
                setJobDescription(e.target.value);
                e.target.nextElementSibling.textContent = `${e.target.value.length} / 5000 chars`;
              }}
              className="panel__textarea"
              placeholder={`Paste the job description here...

Example:
• Senior Frontend Engineer at Google
• 5+ years of experience in React, TypeScript, and large-scale systems
• Proficiency in state management (Redux, Context API)
• Experience with testing frameworks (Jest, Cypress)
• Knowledge of CI/CD pipelines and cloud services (AWS, GCP)`}
              maxLength={5000}
            />
            <div className="char-counter">0 / 5000 chars</div>
          </div>

          {/* Vertical Divider */}
          <div className="panel-divider" />

          {/* Right Panel - Profile */}
          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2>Your Profile</h2>
            </div>

            {/* Upload Resume */}
            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>
              <label className={`dropzone ${resumeInputRef.current?.files[0] ? 'dropzone--success' : ''}`} htmlFor="resume">
                <span className="dropzone__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </span>
                {!resumeInputRef.current?.files[0] ? (
                  <>
                    <p className="dropzone__title">Drag & drop your PDF/DOCX resume or click to browse</p>
                    <p className="dropzone__subtitle">Max 5MB</p>
                  </>
                ) : (
                  <div className="file-info">
                    <svg className="file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <path d="M14 2v6h6" />
                      <path d="M12 12v6" />
                      <path d="M9 12v6" />
                      <path d="M15 12v6" />
                    </svg>
                    <div className="file-details">
                      <p className="file-status">✓ Resume uploaded</p>
                      <span className="file-name">{resumeInputRef.current.files[0].name}</span>
                    </div>
                    <div className="file-actions">
                      <button type="button" className="remove" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        resumeInputRef.current.value = '';
                        e.target.closest('.dropzone').classList.remove('dropzone--success');
                      }}>
                        Remove
                      </button>
                      <button type="button" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        resumeInputRef.current.click();
                      }}>
                        Replace
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      e.target.closest('.dropzone').classList.add('dropzone--success');
                    }
                  }}
                />
              </label>
            </div>

            {/* OR Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Quick Self-Description */}
            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            {/* Info Box */}
            <div className="info-box">
              <span className="info-box__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className="step active">
            <div className="step__number">1</div>
            <div className="step__label">Upload Resume</div>
          </div>
          <div className="step__divider"></div>
          <div className="step">
            <div className="step__number">2</div>
            <div className="step__label">Add Job Description</div>
          </div>
          <div className="step__divider"></div>
          <div className="step">
            <div className="step__number">3</div>
            <div className="step__label">Generate Questions</div>
          </div>
          <div className="step__divider"></div>
          <div className="step">
            <div className="step__number">4</div>
            <div className="step__label">Start Interview</div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button
            onClick={handleGenerateReport}
            className="generate-btn"
            disabled={!jobDescription || (!resumeInputRef.current?.files[0] && !selfDescription)}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            )}
            Generate AI Interview
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;
