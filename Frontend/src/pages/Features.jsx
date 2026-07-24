import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/features.scss";

const Features = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: "📄",
      title: "AI Resume Builder",
      description: "Fill a professional resume form, generate an ATS-friendly resume, preview, and download as PDF.",
      path: "/resume"
    },
    {
      icon: "🎯",
      title: "ATS Resume Score",
      description: "Upload a resume (PDF/DOCX), analyze it, and get ATS score, strengths, weaknesses, and suggestions.",
      path: "/resume"
    },
    {
      icon: "🎤",
      title: "Mock Interview",
      description: "Use your resume and job description to generate AI interview questions, answer one at a time, and get AI feedback.",
      path: "/mock-interview"
    },
    {
      icon: "🤖",
      title: "AI Interview",
      description: "Start an AI-powered interview session with technical and HR questions, record answers, and get a final report.",
      path: "/ai-interview"
    },
    {
      icon: "📊",
      title: "Dashboard",
      description: "View resume score, recent interviews, resume status, job match score, and progress summary.",
      path: "/dashboard"
    },
    {
      icon: "👤",
      title: "Profile",
      description: "View and edit your profile, update skills, education, projects, experience, and profile photo.",
      path: "/profile"
    }
  ];

  const handleFeatureClick = (path) => {
    if (!user) {
      navigate("/login", { state: { message: "Please login to use this feature." } });
      return;
    }
    navigate(path);
  };
  
  const whyChoose = [
    {
      icon: "✓",
      title: "AI Powered",
      description: "Advanced AI technology for personalized preparation."
    },
    {
      icon: "⚡",
      title: "Fast Resume Generation",
      description: "Create professional resumes in minutes."
    },
    {
      icon: "🎯",
      title: "ATS Optimized",
      description: "Resumes designed to pass Applicant Tracking Systems."
    },
    {
      icon: "👤",
      title: "Personalized Experience",
      description: "Tailored to your resume and job description."
    }
  ];
  
  const timelineSteps = [
    {
      title: "Upload Resume",
      description: "Upload your existing resume or create a new one."
    },
    {
      title: "Add Job Description",
      description: "Paste the job description you're applying for."
    },
    {
      title: "Practice Interview",
      description: "Complete AI-powered mock interviews."
    },
    {
      title: "Download Resume & Improve",
      description: "Download your optimized resume and improve your skills."
    }
  ];
  
  return (
    <div className="features-page">
      <div className="features-container">
        {/* Hero Section */}
        <section className="features-hero">
          <h1 className="features-hero__title">
            Everything You Need To Crack Your Dream Job
          </h1>
          <p className="features-hero__subtitle">
            PrepPro combines AI, resume optimization and mock interviews into one platform.
          </p>
          <Link to="#features" className="features-hero__cta">
            Explore Features
          </Link>
        </section>
        
        {/* Features Grid */}
        <section id="features" className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={() => handleFeatureClick(feature.path)}
              style={{ cursor: "pointer" }}
            >
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </div>
          ))}
        </section>
        
        {/* Why Choose Section */}
        <section className="why-choose">
          <h2 className="why-choose__title">Why Choose PrepPro</h2>
          <div className="why-choose-grid">
            {whyChoose.map((item, index) => (
              <div key={index} className="why-card">
                <div className="why-card__icon">{item.icon}</div>
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__description">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="how-it-works__title">How It Works</h2>
          <div className="timeline">
            {timelineSteps.map((step, index) => (
              <div key={index} className="timeline-step">
                <div className="timeline-step__number">{index + 1}</div>
                <h3 className="timeline-step__title">{step.title}</h3>
                <p className="timeline-step__description">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="features-cta">
          <h2 className="features-cta__title">Ready to Start Your Interview Journey?</h2>
          <p className="features-cta__subtitle">
            Create your ATS resume and practice with AI.
          </p>
          <div className="features-cta__buttons">
            <Link to="/register" className="cta-button cta-button--primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button cta-button--secondary">
              Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;