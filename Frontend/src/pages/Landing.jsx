import { Link } from "react-router-dom";
import "../styles/landing.scss";

const Landing = () => {
  return (
    <main className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          {/* Left Content */}
          <div className="hero__content">
            <h1 className="hero__title">
              Prepare Better.
              <br />
              <span className="hero__title-accent">Get Hired Faster.</span>
            </h1>

            <p className="hero__subtitle">
              Build ATS-friendly resumes, practice personalized interviews, and improve your confidence with AI.
            </p>

            <div className="hero__buttons">
              <Link to="/register" className="hero__button hero__button--primary">
                Get Started
              </Link>
              <Link to="/login" className="hero__button hero__button--secondary">
                Login
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hero__illustration">
            <div className="laptop-mockup">
              <div className="laptop-frame">
                <div className="laptop-screen">
                  <div className="dashboard-header">
                    <div className="dashboard-title">Interview Prep Dashboard</div>
                    <div className="dashboard-stats">
                      <div className="stat-card">
                        <div className="stat-value">92%</div>
                        <div className="stat-label">Resume Score</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">4.8/5</div>
                        <div className="stat-label">AI Feedback</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">8/10</div>
                        <div className="stat-label">Job Match</div>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-content">
                    <div className="mock-interview-card">
                      <div className="mock-interview-icon">🎤</div>
                      <div className="mock-interview-title">Mock Interview</div>
                      <div className="mock-interview-subtitle">Practice with AI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features__container">
          <h2 className="features__heading">Everything you need to crack interviews</h2>
          <div className="features__grid">
            {[
              {
                icon: "📄",
                title: "Resume Builder",
                description: "Create ATS-optimized resumes with professional templates"
              },
              {
                icon: "🎯",
                title: "Job-Based Questions",
                description: "Get tailored questions based on the actual job description"
              },
              {
                icon: "🎤",
                title: "Mock Interviews",
                description: "Practice with realistic interview scenarios"
              },
              {
                icon: "🤖",
                title: "AI Feedback",
                description: "Get instant, personalized feedback on your answers"
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-card__icon">{feature.icon}</div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta__container">
          <h2 className="cta__title">Ready to ace your next interview?</h2>
          <div className="cta__buttons">
            <Link to="/register" className="cta__button cta__button--primary">
              Register Now
            </Link>
            <Link to="/login" className="cta__button cta__button--secondary">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
