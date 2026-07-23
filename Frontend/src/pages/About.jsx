import { Link } from "react-router-dom";
import "../styles/about.scss";

const offers = [
  { icon: "▣", title: "ATS Resume Builder", text: "Build polished resumes designed to pass applicant tracking systems." },
  { icon: "◉", title: "AI Mock Interviews", text: "Practice realistic conversations and sharpen your interview presence." },
  { icon: "✦", title: "Personalized Questions", text: "Prepare with questions shaped around your role and experience." },
  { icon: "⇩", title: "Resume PDF Generator", text: "Turn your finished resume into a clean, ready-to-share PDF." },
  { icon: "↗", title: "AI Feedback", text: "Get thoughtful guidance that helps every answer land better." },
  { icon: "◒", title: "Progress Tracking", text: "See your momentum clearly as your preparation gets stronger." },
];

const stats = [
  { value: "1000+", label: "Resumes Created" },
  { value: "95%", label: "ATS Friendly" },
  { value: "24/7", label: "AI Assistance" },
  { value: "100%", label: "Free Learning" },
];

const About = () => {
  return (
    <main className="about-page">
      <div className="about-page__orb about-page__orb--top" aria-hidden="true" />
      <div className="about-page__orb about-page__orb--bottom" aria-hidden="true" />

      <div className="about-page__container">
        <section className="about-hero">
          <p className="about-hero__eyebrow">The smarter way forward</p>
          <h1>About <span>PrepPro</span></h1>
          <p className="about-hero__subtitle">
            We help students and job seekers prepare smarter using Artificial Intelligence.
          </p>
        </section>

        <section className="mission-card" aria-labelledby="mission-title">
          <div className="about-icon">✦</div>
          <div>
            <p className="section-kicker">Built for your next opportunity</p>
            <h2 id="mission-title">Our Mission</h2>
            <p>
              Our mission is to make interview preparation easier, smarter and more accessible by combining AI-powered resume building, ATS optimization and personalized mock interviews.
            </p>
          </div>
        </section>

        <section className="about-section" aria-labelledby="offer-title">
          <div className="section-heading">
            <p className="section-kicker">Everything in one place</p>
            <h2 id="offer-title">What We Offer</h2>
          </div>
          <div className="offer-grid">
            {offers.map((offer) => (
              <article className="offer-card" key={offer.title}>
                <div className="about-icon about-icon--small">{offer.icon}</div>
                <h3>{offer.title}</h3>
                <p>{offer.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" aria-labelledby="why-title">
          <div className="section-heading">
            <p className="section-kicker">Progress you can feel</p>
            <h2 id="why-title">Why PrepPro</h2>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="vision-card" aria-labelledby="vision-title">
          <div>
            <p className="section-kicker">Looking ahead</p>
            <h2 id="vision-title">Our Vision</h2>
          </div>
          <p>
            Our vision is to empower every student and professional with intelligent tools that increase confidence and improve interview success.
          </p>
        </section>

        <section className="about-cta" aria-labelledby="cta-title">
          <p className="section-kicker">Your next chapter starts here</p>
          <h2 id="cta-title">Start Your Career Journey Today</h2>
          <p>Join PrepPro and prepare with confidence.</p>
          <div className="about-cta__actions">
            <Link to="/register" className="about-button about-button--primary">Get Started</Link>
            <Link to="/login" className="about-button about-button--secondary">Login</Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;