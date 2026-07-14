import React, { useState, useRef } from "react";
import "../styles/dashboard.scss";
import { useInterview } from "../features/interview/hooks/useInterview.js";
import { useNavigate } from "react-router";

const Dashboard = () => {
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
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
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
              }}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
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

            <div className="profile-section">
              <label htmlFor="self-description" className="panel__label">
                Tell us about yourself
              </label>
              <textarea
                id="self-description"
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                className="panel__textarea"
                placeholder={`Share your experience, skills, and background...\ne.g. '5 years as Frontend Engineer with expertise in React and TypeScript'`}
                maxLength={5000}
              />
              <div className="char-counter">0 / 5000 chars</div>
            </div>

            <div className="profile-section">
              <label htmlFor="resume" className="panel__label">
                Upload Your Resume
              </label>
              <input
                id="resume"
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="panel__file-input"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            ✨ AI will analyze your profile and create a personalized plan
          </span>
          <button
            onClick={handleGenerateReport}
            className="button primary-button"
            disabled={!jobDescription || !selfDescription || !resumeInputRef.current?.files[0]}
          >
            Generate Interview Plan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
