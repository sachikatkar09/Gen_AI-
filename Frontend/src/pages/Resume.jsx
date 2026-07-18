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

// ── Preview Component ────────────────────────────────────────────────────────
const ResumePreview = ({ data }) => {
  const hasContent = data.personal.fullName || data.summary || data.skills.length || data.education.some((e) => e.college) || data.projects.some((p) => p.name) || data.experience.some((e) => e.company);

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

  return (
    <div className="ats-resume">
      {data.personal.fullName && <div className="ats-resume__name">{data.personal.fullName}</div>}
      <div className="ats-resume__contact">
        {data.personal.email && <span className="ats-resume__contact-item">{data.personal.email}</span>}
        {data.personal.phone && <span className="ats-resume__contact-item">{data.personal.phone}</span>}
        {data.personal.location && <span className="ats-resume__contact-item">{data.personal.location}</span>}
        {data.personal.linkedin && <span className="ats-resume__contact-item">LinkedIn</span>}
        {data.personal.github && <span className="ats-resume__contact-item">GitHub</span>}
        {data.personal.portfolio && <span className="ats-resume__contact-item">Portfolio</span>}
      </div>

      {data.summary && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Professional Summary</div>
          <div className="ats-resume__summary">{data.summary}</div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Skills</div>
          <div className="ats-resume__skills">
            {data.skills.map((s) => <span className="ats-resume__skill-tag" key={s}>{s}</span>)}
          </div>
        </div>
      )}

      {data.education.some((e) => e.college) && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Education</div>
          {data.education.filter((e) => e.college).map((edu, i) => (
            <div className="ats-resume__entry" key={i}>
              <div className="ats-resume__entry-header">
                <span className="ats-resume__entry-title">{edu.degree}{edu.branch ? ` in ${edu.branch}` : ""}</span>
                <span className="ats-resume__entry-date">{edu.startYear}{edu.endYear ? ` - ${edu.endYear}` : ""}</span>
              </div>
              <div className="ats-resume__entry-subtitle">{edu.college}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ""}</div>
            </div>
          ))}
        </div>
      )}

      {data.projects.some((p) => p.name) && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Projects</div>
          {data.projects.filter((p) => p.name).map((proj, i) => (
            <div className="ats-resume__entry" key={i}>
              <div className="ats-resume__entry-header">
                <span className="ats-resume__entry-title">{proj.name}</span>
              </div>
              {proj.technologies && <div className="ats-resume__entry-subtitle">{proj.technologies}</div>}
              {proj.description && <div className="ats-resume__entry-desc">{proj.description}</div>}
            </div>
          ))}
        </div>
      )}

      {data.experience.some((e) => e.company) && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Experience</div>
          {data.experience.filter((e) => e.company).map((exp, i) => (
            <div className="ats-resume__entry" key={i}>
              <div className="ats-resume__entry-header">
                <span className="ats-resume__entry-title">{exp.role}</span>
                <span className="ats-resume__entry-date">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ""}</span>
              </div>
              <div className="ats-resume__entry-subtitle">{exp.company}</div>
              {exp.description && <div className="ats-resume__entry-desc">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {data.certifications.some((c) => c.name) && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Certifications</div>
          {data.certifications.filter((c) => c.name).map((cert, i) => (
            <div className="ats-resume__entry" key={i}>
              <div className="ats-resume__entry-header">
                <span className="ats-resume__entry-title">{cert.name}</span>
                <span className="ats-resume__entry-date">{cert.year}</span>
              </div>
              {cert.organization && <div className="ats-resume__entry-subtitle">{cert.organization}</div>}
            </div>
          ))}
        </div>
      )}

      {data.achievements.filter((a) => a).length > 0 && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Achievements</div>
          <ul className="ats-resume__list">
            {data.achievements.filter((a) => a).map((ach, i) => <li key={i}>{ach}</li>)}
          </ul>
        </div>
      )}

      {data.languages.filter((l) => l).length > 0 && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Languages</div>
          <div className="ats-resume__languages">{data.languages.filter((l) => l).join(", ")}</div>
        </div>
      )}

      {data.interests && (
        <div className="ats-resume__section">
          <div className="ats-resume__section-title">Interests</div>
          <div className="ats-resume__interests">{data.interests}</div>
        </div>
      )}
    </div>
  );
};

// ── Print Version (for PDF) ──────────────────────────────────────────────────
const ResumePrint = ({ data }) => (
  <ResumePreview data={data} />
);

export default Resume;
