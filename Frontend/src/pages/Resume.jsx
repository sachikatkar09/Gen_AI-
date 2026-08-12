import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/resume.scss";

const emptyPersonal = { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" };
const emptyEducation = { college: "", degree: "", branch: "", cgpa: "", startYear: "", endYear: "" };
const emptyProject = { name: "", description: "", technologies: "", github: "", live: "" };
const emptyExperience = { company: "", role: "", startDate: "", endDate: "", description: "" };
const emptyCertification = { name: "", organization: "", year: "" };

const defaultData = {
  personal: { ...emptyPersonal },
  summary: "",
  education: [{ ...emptyEducation }],
  skills: [],
  projects: [{ ...emptyProject }],
  experience: [{ ...emptyExperience }],
  certifications: [{ ...emptyCertification }],
  achievements: [""],
  languages: [""],
  interests: "",
};

const Resume = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("resume_draft");
    return saved ? JSON.parse(saved) : { ...defaultData };
  });
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("resume_draft", JSON.stringify(data));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const update = (section, value) => {
    setData((prev) => ({ ...prev, [section]: value }));
  };

  const updatePersonal = (field, value) => {
    setData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setData((prev) => {
      const arr = [...prev[section]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: arr };
    });
  };

  const updateSimpleArrayItem = (section, index, value) => {
    setData((prev) => {
      const arr = [...prev[section]];
      arr[index] = value;
      return { ...prev, [section]: arr };
    });
  };

  const addEntry = (section, template) => {
    setData((prev) => ({ ...prev, [section]: [...prev[section], { ...template }] }));
  };

  const addSimpleEntry = (section) => {
    setData((prev) => ({ ...prev, [section]: [...prev[section], ""] }));
  };

  const removeEntry = (section, index) => {
    setData((prev) => {
      const arr = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: arr.length ? arr : [typeof prev[section][0] === "object" ? { ...Object.fromEntries(Object.keys(prev[section][0]).map((k) => [k, ""])) } : ""] };
    });
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      update("skills", [...data.skills, trimmed]);
    }
  };

  const removeSkill = (skill) => {
    update("skills", data.skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput("");
    } else if (e.key === "Backspace" && !skillInput && data.skills.length) {
      removeSkill(data.skills[data.skills.length - 1]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!data.personal.fullName.trim()) errs.fullName = "Required";
    if (!data.personal.email.trim()) errs.email = "Required";
    if (!data.personal.phone.trim()) errs.phone = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = () => {
    localStorage.setItem("resume_draft", JSON.stringify(data));
  };

  const handleClear = () => {
    if (window.confirm("Clear all fields? This cannot be undone.")) {
      setData({ ...defaultData });
      localStorage.removeItem("resume_draft");
    }
  };

  const handlePreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGeneratePDF = async () => {
    if (!validate()) return;
    setGenerating(true);
    try {
      const el = printRef.current;
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personal.fullName || "resume"}_resume.pdf`);
    } catch {
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="resume-page">
      <header className="resume-header">
        <h1 className="resume-header__title">Resume Builder</h1>
        <p className="resume-header__subtitle">
          Fill in your details and generate a professional ATS-friendly resume in PDF format.
        </p>
      </header>

      <div className="resume-actions">
        <button className="action-btn action-btn--secondary" onClick={handleSaveDraft}>Save Draft</button>
        <button className="action-btn action-btn--secondary" onClick={handlePreview}>Preview Resume</button>
        <button className="action-btn action-btn--primary" onClick={handleGeneratePDF} disabled={generating}>
          {generating ? "Generating..." : "Generate PDF"}
        </button>
        <button className="action-btn action-btn--danger" onClick={handleClear}>Clear Form</button>
      </div>

      <div className="resume-layout">
        {/* ── Form Panel ── */}
        <div className="resume-form">

          {/* Section 1: Personal Information */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">👤</span>
              <h2 className="resume-section__title">Personal Information</h2>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.fullName ? "error" : ""}`} value={data.personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="John Doe" />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className={`form-input ${errors.email ? "error" : ""}`} type="email" value={data.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="john@example.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className={`form-input ${errors.phone ? "error" : ""}`} value={data.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+1 234 567 890" />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={data.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="San Francisco, CA" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" value={data.personal.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="https://linkedin.com/in/johndoe" />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" value={data.personal.github} onChange={(e) => updatePersonal("github", e.target.value)} placeholder="https://github.com/johndoe" />
              </div>
            </div>
            <div className="form-row form-row--single">
              <div className="form-group">
                <label className="form-label">Portfolio Website</label>
                <input className="form-input" value={data.personal.portfolio} onChange={(e) => updatePersonal("portfolio", e.target.value)} placeholder="https://johndoe.dev" />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Summary */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">📝</span>
              <h2 className="resume-section__title">Professional Summary</h2>
            </div>
            <div className="form-group">
              <textarea className="form-textarea" rows={4} value={data.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Write a short professional summary about yourself..." />
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">🎓</span>
              <h2 className="resume-section__title">Education</h2>
            </div>
            {data.education.map((edu, i) => (
              <div className="entry-card" key={i}>
                {data.education.length > 1 && <button className="entry-remove" onClick={() => removeEntry("education", i)}>&times;</button>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">College / University</label>
                    <input className="form-input" value={edu.college} onChange={(e) => updateArrayItem("education", i, "college", e.target.value)} placeholder="MIT" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input className="form-input" value={edu.degree} onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)} placeholder="B.Tech" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input className="form-input" value={edu.branch} onChange={(e) => updateArrayItem("education", i, "branch", e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CGPA / Percentage</label>
                    <input className="form-input" value={edu.cgpa} onChange={(e) => updateArrayItem("education", i, "cgpa", e.target.value)} placeholder="8.5 / 10" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Year</label>
                    <input className="form-input" value={edu.startYear} onChange={(e) => updateArrayItem("education", i, "startYear", e.target.value)} placeholder="2020" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Year</label>
                    <input className="form-input" value={edu.endYear} onChange={(e) => updateArrayItem("education", i, "endYear", e.target.value)} placeholder="2024" />
                  </div>
                </div>
              </div>
            ))}
            <button className="add-button" onClick={() => addEntry("education", { ...emptyEducation })}>+ Add Education</button>
          </div>

          {/* Section 4: Skills */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">⚡</span>
              <h2 className="resume-section__title">Skills</h2>
            </div>
            <div className="tags-container" onClick={() => document.getElementById("skill-input")?.focus()}>
              {data.skills.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                  <span className="tag__remove" onClick={() => removeSkill(skill)}>&times;</span>
                </span>
              ))}
              <input id="skill-input" className="tag-input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder={data.skills.length ? "" : "Type a skill and press Enter..."} />
            </div>
          </div>

          {/* Section 5: Projects */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">🚀</span>
              <h2 className="resume-section__title">Projects</h2>
            </div>
            {data.projects.map((proj, i) => (
              <div className="entry-card" key={i}>
                {data.projects.length > 1 && <button className="entry-remove" onClick={() => removeEntry("projects", i)}>&times;</button>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Project Name</label>
                    <input className="form-input" value={proj.name} onChange={(e) => updateArrayItem("projects", i, "name", e.target.value)} placeholder="E-Commerce Platform" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technologies Used</label>
                    <input className="form-input" value={proj.technologies} onChange={(e) => updateArrayItem("projects", i, "technologies", e.target.value)} placeholder="React, Node.js, MongoDB" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2} value={proj.description} onChange={(e) => updateArrayItem("projects", i, "description", e.target.value)} placeholder="Built a full-stack e-commerce platform with..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub Link</label>
                    <input className="form-input" value={proj.github} onChange={(e) => updateArrayItem("projects", i, "github", e.target.value)} placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Demo Link</label>
                    <input className="form-input" value={proj.live} onChange={(e) => updateArrayItem("projects", i, "live", e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>
            ))}
            <button className="add-button" onClick={() => addEntry("projects", { ...emptyProject })}>+ Add Project</button>
          </div>

          {/* Section 6: Experience */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">💼</span>
              <h2 className="resume-section__title">Experience</h2>
            </div>
            {data.experience.map((exp, i) => (
              <div className="entry-card" key={i}>
                {data.experience.length > 1 && <button className="entry-remove" onClick={() => removeEntry("experience", i)}>&times;</button>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input className="form-input" value={exp.company} onChange={(e) => updateArrayItem("experience", i, "company", e.target.value)} placeholder="Google" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input className="form-input" value={exp.role} onChange={(e) => updateArrayItem("experience", i, "role", e.target.value)} placeholder="Software Engineer" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" value={exp.startDate} onChange={(e) => updateArrayItem("experience", i, "startDate", e.target.value)} placeholder="Jan 2023" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" value={exp.endDate} onChange={(e) => updateArrayItem("experience", i, "endDate", e.target.value)} placeholder="Present" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2} value={exp.description} onChange={(e) => updateArrayItem("experience", i, "description", e.target.value)} placeholder="Led development of microservices architecture..." />
                </div>
              </div>
            ))}
            <button className="add-button" onClick={() => addEntry("experience", { ...emptyExperience })}>+ Add Experience</button>
          </div>

          {/* Section 7: Certifications */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">🏆</span>
              <h2 className="resume-section__title">Certifications</h2>
            </div>
            {data.certifications.map((cert, i) => (
              <div className="entry-card" key={i}>
                {data.certifications.length > 1 && <button className="entry-remove" onClick={() => removeEntry("certifications", i)}>&times;</button>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Certification Name</label>
                    <input className="form-input" value={cert.name} onChange={(e) => updateArrayItem("certifications", i, "name", e.target.value)} placeholder="AWS Solutions Architect" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input className="form-input" value={cert.organization} onChange={(e) => updateArrayItem("certifications", i, "organization", e.target.value)} placeholder="Amazon Web Services" />
                  </div>
                </div>
                <div className="form-row form-row--single">
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input className="form-input" value={cert.year} onChange={(e) => updateArrayItem("certifications", i, "year", e.target.value)} placeholder="2024" />
                  </div>
                </div>
              </div>
            ))}
            <button className="add-button" onClick={() => addEntry("certifications", { ...emptyCertification })}>+ Add Certification</button>
          </div>

          {/* Section 8: Achievements */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">🌟</span>
              <h2 className="resume-section__title">Achievements</h2>
            </div>
            {data.achievements.map((ach, i) => (
              <div className="entry-card" key={i}>
                {data.achievements.length > 1 && <button className="entry-remove" onClick={() => removeEntry("achievements", i)}>&times;</button>}
                <div className="form-group">
                  <input className="form-input" value={ach} onChange={(e) => updateSimpleArrayItem("achievements", i, e.target.value)} placeholder="Won 1st place at hackathon with 200+ teams" />
                </div>
              </div>
            ))}
            <button className="add-button" onClick={() => addSimpleEntry("achievements")}>+ Add Achievement</button>
          </div>

          {/* Section 9: Languages */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">🌐</span>
              <h2 className="resume-section__title">Languages</h2>
            </div>
            {data.languages.map((lang, i) => (
              <div className="entry-card" key={i}>
                {data.languages.length > 1 && <button className="entry-remove" onClick={() => removeEntry("languages", i)}>&times;</button>}
                <div className="form-group">
                  <input className="form-input" value={lang} onChange={(e) => updateSimpleArrayItem("languages", i, e.target.value)} placeholder="English, Hindi, Spanish..." />
                </div>
              </div>
            ))}
            <button className="add-button" onClick={() => addSimpleEntry("languages")}>+ Add Language</button>
          </div>

          {/* Section 10: Interests */}
          <div className="resume-section">
            <div className="resume-section__header">
              <span className="resume-section__icon">❤️</span>
              <h2 className="resume-section__title">Interests</h2>
            </div>
            <div className="form-group">
              <textarea className="form-textarea" rows={2} value={data.interests} onChange={(e) => update("interests", e.target.value)} placeholder="Open source contribution, blogging, chess..." />
            </div>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div className="resume-preview" ref={previewRef}>
          <div className="resume-preview__wrapper">
            <div className="resume-preview__toolbar">
              <div className="resume-preview__dots">
                <span className="resume-preview__toolbar-dot resume-preview__toolbar-dot--red"></span>
                <span className="resume-preview__toolbar-dot resume-preview__toolbar-dot--yellow"></span>
                <span className="resume-preview__toolbar-dot resume-preview__toolbar-dot--green"></span>
              </div>
              <span className="resume-preview__toolbar-title">Resume Preview</span>
              <span></span>
            </div>
            <ResumePreview data={data} />
          </div>
        </div>
      </div>

      {/* Hidden print container */}
      <div id="print-container" ref={printRef}>
        <ResumePrint data={data} />
      </div>
    </div>
  );
};

// ── ATS Resume Component (Shared for Preview and PDF) ────────────────────────
const ATSResume = ({ data, isPrint = false }) => {
  // Format contact information
  const formatContactInfo = () => {
    const contactItems = [];
    
    if (data.personal.phone) contactItems.push(data.personal.phone);
    if (data.personal.email) contactItems.push(data.personal.email);
    if (data.personal.location) contactItems.push(data.personal.location);
    if (data.personal.linkedin) contactItems.push(`LinkedIn: ${data.personal.linkedin.replace(/^https?:\/\//, '')}`);
    if (data.personal.github) contactItems.push(`GitHub: ${data.personal.github.replace(/^https?:\/\//, '')}`);
    if (data.personal.portfolio) contactItems.push(`Portfolio: ${data.personal.portfolio.replace(/^https?:\/\//, '')}`);
    
    return contactItems.join(' | ');
  };
  
  // Format experience description
  const formatDescription = (description) => {
    if (!description) return null;
    
    // Split by newlines or bullet points
    const items = description.split(/\n|•|\*|-/).filter(item => item.trim());
    
    if (items.length <= 1) {
      return <p style={{ margin: '0.3rem 0' }}>{description}</p>;
    }
    
    return (
      <ul style={{ margin: '0.3rem 0 0 1.2rem', padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '0.2rem' }}>{item.trim()}</li>
        ))}
      </ul>
    );
  };
  
  // Format project features
  const formatProjectFeatures = (description) => {
    if (!description) return null;
    
    const items = description.split(/\n|•|\*|-/).filter(item => item.trim());
    
    if (items.length <= 1) {
      return <p style={{ margin: '0.3rem 0' }}>{description}</p>;
    }
    
    return (
      <ul style={{ margin: '0.3rem 0 0 1.2rem', padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '0.2rem' }}>{item.trim()}</li>
        ))}
      </ul>
    );
  };
  
  // Check if section has content
  const hasSummary = data.summary && data.summary.trim();
  const hasSkills = data.skills && data.skills.length > 0;
  const hasEducation = data.education && data.education.some(e => e.college && e.college.trim());
  const hasExperience = data.experience && data.experience.some(e => e.company && e.company.trim());
  const hasProjects = data.projects && data.projects.some(p => p.name && p.name.trim());
  const hasCertifications = data.certifications && data.certifications.some(c => c.name && c.name.trim());
  const hasAchievements = data.achievements && data.achievements.some(a => a && a.trim());
  const hasLanguages = data.languages && data.languages.some(l => l && l.trim());
  const hasInterests = data.interests && data.interests.trim();

  // Font settings
  const fontFamily = isPrint ? "'Inter', Arial, sans-serif" : "'Inter', Arial, sans-serif";
  const baseFontSize = isPrint ? '11pt' : '14px';
  const lineHeight = isPrint ? '1.4' : '1.5';
  
  return (
     <div style={
       isPrint ? {
         fontFamily: "'Inter', Arial, sans-serif",
         fontSize: baseFontSize,
         lineHeight: lineHeight,
         color: '#000000',
         width: '100%',
         maxWidth: '8.5in',
         margin: '0 auto',
         padding: '0.6in',
         pageBreakAfter: 'avoid'
       } : {
         fontFamily: "'Inter', Arial, sans-serif",
         fontSize: baseFontSize,
         lineHeight: lineHeight,
         color: '#000000',
         width: '100%',
         maxWidth: '816px', // A4 width in pixels at 96dpi
         margin: '0 auto',
         padding: '24px',
         boxShadow: '0 0 20px rgba(0,0,0,0.1)',
         background: 'white',
         minHeight: '1122px' // A4 height in pixels at 96dpi
       }
     }>
      {/* Header */}
      {data.personal.fullName && (
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
           <h1 style={
             isPrint ? {
               fontSize: '24pt',
               fontWeight: '700',
               margin: '0 0 2px 0',
               lineHeight: '1.2',
               color: '#000000'
             } : {
               fontSize: '24px',
               fontWeight: '700',
               margin: '0 0 4px 0',
               lineHeight: '1.2',
               color: '#000000'
             }
           }>
             {data.personal.fullName}
           </h1>
        </div>
      )}
      
        {formatContactInfo() && (
          <div style={isPrint ? {
              textAlign: 'center',
              fontSize: '10pt',
              color: '#555555',
              marginBottom: '12px',
              paddingBottom: '6px',
              fontWeight: '400'
            } : {
              textAlign: 'center',
              fontSize: '12px',
              color: '#555555',
              marginBottom: '14px',
              paddingBottom: '8px',
              fontWeight: '400'
            }}>
            {formatContactInfo()}
          </div>
        )}
      
      {/* Professional Summary */}
      {hasSummary && (
        <div style={{ marginBottom: '16px' }}>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Professional Summary
           </h2>
           <p style={{ margin: '0', fontSize: isPrint ? '10pt' : '12px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{data.summary}</p>
        </div>
      )}
      
       {/* Technical Skills */}
        {hasSkills && (
          <div style={{ marginBottom: '16px' }}>
             <h2 style={isPrint ? {
                 fontSize: '14pt',
                 fontWeight: '600',
                 textTransform: 'uppercase',
                 margin: '0 0 8px 0',
                 color: '#000000',
                 letterSpacing: '0.5px',
                 borderBottom: '1px solid #dddddd',
                 paddingBottom: '4px'
               } : {
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                margin: '0 0 10px 0',
                color: '#000000',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #dddddd',
                paddingBottom: '5px'
              }}>
             Technical Skills
           </h2>
           <p style={{ margin: '0', fontSize: isPrint ? '10pt' : '12px', lineHeight: '1.6' }}>{data.skills.join(', ')}</p>
         </div>
       )}
      
      {/* Experience */}
      {hasExperience && (
        <div style={{ marginBottom: '16px' }}>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Experience
           </h2>
          {data.experience.filter(e => e.company && e.company.trim()).map((exp, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                 <span style={{ fontWeight: '600', fontSize: isPrint ? '11pt' : '13px' }}>{exp.role}</span>
                 <span style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                 <span style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>{exp.company}</span>
               </div>
               <div>
                 {formatDescription(exp.description)}
               </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Projects */}
      {hasProjects && (
        <div style={{ marginBottom: '16px' }}>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Projects
           </h2>
          {data.projects.filter(p => p.name && p.name.trim()).map((proj, i) => (
             <div key={i} style={{ marginBottom: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                 <span style={{ fontWeight: '600', fontSize: isPrint ? '11pt' : '13px' }}>{proj.name}</span>
               </div>
               {proj.technologies && <div style={{ marginBottom: '4px', fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>{proj.technologies}</div>}
               <div>
                 {proj.github && (
                   <p style={{ margin: '0.2rem 0', fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>GitHub: {proj.github.replace(/^https?:\/\//, '')}</p>
                 )}
                 {proj.live && (
                   <p style={{ margin: '0.2rem 0', fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>Live: {proj.live.replace(/^https?:\/\//, '')}</p>
                 )}
                 {formatProjectFeatures(proj.description)}
               </div>
             </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {hasEducation && (
        <div style={{ marginBottom: '16px' }}>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Education
           </h2>
          {data.education.filter(e => e.college && e.college.trim()).map((edu, i) => (
             <div key={i} style={{ marginBottom: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                 <span style={{ fontWeight: '600', fontSize: isPrint ? '11pt' : '13px' }}>{edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}</span>
                 <span style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>{edu.startYear}{edu.endYear ? ` - ${edu.endYear}` : ''}</span>
               </div>
               <div style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555', marginBottom: '2px' }}>{edu.college}</div>
               <div style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>CGPA: {edu.cgpa}</div>
             </div>
          ))}
        </div>
      )}
      
      {/* Certifications */}
      {hasCertifications && (
        <div style={{ marginBottom: '16px' }}>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Certifications
           </h2>
           {data.certifications.filter(c => c.name && c.name.trim()).map((cert, i) => (
             <div key={i} style={{ marginBottom: '12px' }}>
               <div style={{ fontWeight: '600', fontSize: isPrint ? '11pt' : '13px', marginBottom: '2px' }}>{cert.name}</div>
               <div style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555', marginBottom: '2px' }}>{cert.organization}</div>
               <div style={{ fontSize: isPrint ? '10pt' : '12px', color: '#555555' }}>{cert.year}</div>
             </div>
           ))}
        </div>
      )}
      
      {/* Achievements */}
            {hasAchievements && (
              <div style={{ marginBottom: '16px' }}>
                <h2 style={isPrint ? {
                  fontSize: '14pt',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  margin: '0 0 8px 0',
                  color: '#000000',
                  letterSpacing: '0.5px',
                  borderBottom: '1px solid #dddddd',
                  paddingBottom: '4px'
                } : {
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  margin: '0 0 10px 0',
                  color: '#000000',
                  letterSpacing: '0.5px',
                  borderBottom: '1px solid #dddddd',
                  paddingBottom: '5px'
                }}>
                  Achievements
                </h2>
                <ul style={{ margin: '0 0 0 16px', padding: 0 }}>
                  {data.achievements.filter(a => a && a.trim()).map((achievement, i) => (
                    <li key={i} style={{ marginBottom: '6px', fontSize: isPrint ? '10pt' : '12px', lineHeight: '1.5' }}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
      
      {/* Languages */}
      {hasLanguages && (
        <div style={{ marginBottom: '16px' }}>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Languages
           </h2>
           <p style={{ margin: '0', fontSize: isPrint ? '10pt' : '12px', lineHeight: '1.5' }}>{data.languages.filter(l => l && l.trim()).join(', ')}</p>
        </div>
      )}
      
      {/* Interests */}
      {hasInterests && (
        <div>
           <h2 style={
             isPrint ? {
               fontSize: '14pt',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 8px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '4px'
             } : {
               fontSize: '14px',
               fontWeight: '600',
               textTransform: 'uppercase',
               margin: '0 0 10px 0',
               color: '#000000',
               letterSpacing: '0.5px',
               borderBottom: '1px solid #dddddd',
               paddingBottom: '5px'
             }
           }>
             Interests
           </h2>
           <p style={{ margin: '0', fontSize: isPrint ? '10pt' : '12px', lineHeight: '1.5' }}>{data.interests}</p>
        </div>
      )}
    </div>
  );
};

// ── Preview Component ────────────────────────────────────────────────────────
const ResumePreview = ({ data }) => {
  const hasContent = data.personal.fullName || data.summary || data.skills.length || 
                    data.education.some((e) => e.college) || data.projects.some((p) => p.name) || 
                    data.experience.some((e) => e.company);

  if (!hasContent) {
    return (
      <div className="ats-resume">
        <div className="ats-resume__empty">
          <p>Your resume preview will appear here.</p>
          <p>Start filling in your details on the left.</p>
        </div>
      </div>
    );
  }

  return <ATSResume data={data} />;
};

// ── Print Version (for PDF) ──────────────────────────────────────────────────
const ResumePrint = ({ data }) => (
  <ATSResume data={data} isPrint={true} />
);

export default Resume;
