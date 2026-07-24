import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/profile.scss";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    profilePhoto: null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [educationInput, setEducationInput] = useState({
    college: "",
    degree: "",
    branch: "",
    cgpa: "",
    startYear: "",
    endYear: "",
  });

  const [experienceInput, setExperienceInput] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [projectInput, setProjectInput] = useState({
    name: "",
    description: "",
    technologies: "",
    github: "",
    live: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        projects: user.projects || [],
        profilePhoto: user.profilePhoto || null,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !profile.skills.includes(trimmed)) {
        setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationInput((prev) => ({ ...prev, [name]: value }));
  };

  const addEducation = () => {
    if (educationInput.college && educationInput.degree) {
      setProfile((prev) => ({ ...prev, education: [...prev.education, educationInput] }));
      setEducationInput({
        college: "",
        degree: "",
        branch: "",
        cgpa: "",
        startYear: "",
        endYear: "",
      });
    }
  };

  const removeEducation = (index) => {
    setProfile((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperienceInput((prev) => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    if (experienceInput.company && experienceInput.role) {
      setProfile((prev) => ({ ...prev, experience: [...prev.experience, experienceInput] }));
      setExperienceInput({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  };

  const removeExperience = (index) => {
    setProfile((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectInput((prev) => ({ ...prev, [name]: value }));
  };

  const addProject = () => {
    if (projectInput.name) {
      setProfile((prev) => ({ ...prev, projects: [...prev.projects, projectInput] }));
      setProjectInput({
        name: "",
        description: "",
        technologies: "",
        github: "",
        live: "",
      });
    }
  };

  const removeProject = (index) => {
    setProfile((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, profilePhoto: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    if (!profile.fullName || !profile.email) {
      setError("Full Name and Email are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateProfile(profile);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile</h1>
          <p>Please log in to view your profile.</p>
          <button onClick={() => navigate("/login")} className="btn btn-primary">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
          ) : (
            <div className="profile-actions">
              <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-grid">
          {/* Profile Photo */}
          <div className="profile-section">
            <h2>Profile Photo</h2>
            <div className="profile-photo">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile" className="profile-photo__image" />
              ) : (
                <div className="profile-photo__placeholder">👤</div>
              )}
              {isEditing && (
                <label className="profile-photo__upload">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                  Change Photo
                </label>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="profile-section">
            <h2>Social Links</h2>
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input
                type="text"
                name="github"
                value={profile.github}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div className="form-group">
              <label>Portfolio</label>
              <input
                type="text"
                name="portfolio"
                value={profile.portfolio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-control"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="profile-section">
            <h2>Skills</h2>
            {isEditing ? (
              <div className="skills-input">
                <div className="tags-container" onClick={() => document.getElementById("skill-input")?.focus()}> 
                  {profile.skills.map((skill) => (
                    <span className="tag" key={skill}>
                      {skill}
                      <span className="tag__remove" onClick={() => removeSkill(skill)}>&times;</span>
                    </span>
                  ))}
                  <input
                    id="skill-input"
                    className="tag-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder={profile.skills.length ? "" : "Type a skill and press Enter..."}
                  />
                </div>
              </div>
            ) : (
              <div className="skills-list">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill) => <span key={skill} className="skill-badge">{skill}</span>)
                ) : (
                  <p>No skills added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="profile-section">
            <h2>Education</h2>
            {isEditing ? (
              <div className="education-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>College</label>
                    <input
                      type="text"
                      name="college"
                      value={educationInput.college}
                      onChange={handleEducationChange}
                      className="form-control"
                      placeholder="MIT"
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={educationInput.degree}
                      onChange={handleEducationChange}
                      className="form-control"
                      placeholder="B.Tech"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={educationInput.branch}
                      onChange={handleEducationChange}
                      className="form-control"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>CGPA</label>
                    <input
                      type="text"
                      name="cgpa"
                      value={educationInput.cgpa}
                      onChange={handleEducationChange}
                      className="form-control"
                      placeholder="8.5"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Year</label>
                    <input
                      type="text"
                      name="startYear"
                      value={educationInput.startYear}
                      onChange={handleEducationChange}
                      className="form-control"
                      placeholder="2020"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Year</label>
                    <input
                      type="text"
                      name="endYear"
                      value={educationInput.endYear}
                      onChange={handleEducationChange}
                      className="form-control"
                      placeholder="2024"
                    />
                  </div>
                </div>
                <button onClick={addEducation} className="btn btn-secondary">Add Education</button>
              </div>
            ) : (
              <div className="education-list">
                {profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h4>{edu.degree} in {edu.branch}</h4>
                      <p>{edu.college} ({edu.startYear} - {edu.endYear})</p>
                      <p>CGPA: {edu.cgpa}</p>
                    </div>
                  ))
                ) : (
                  <p>No education added yet.</p>
                )}
              </div>
            )}
            {isEditing && profile.education.length > 0 && (
              <div className="education-list">
                {profile.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.degree} in {edu.branch}</h4>
                    <p>{edu.college} ({edu.startYear} - {edu.endYear})</p>
                    <p>CGPA: {edu.cgpa}</p>
                    <button onClick={() => removeEducation(index)} className="btn btn-danger">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="profile-section">
            <h2>Experience</h2>
            {isEditing ? (
              <div className="experience-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={experienceInput.company}
                      onChange={handleExperienceChange}
                      className="form-control"
                      placeholder="Google"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={experienceInput.role}
                      onChange={handleExperienceChange}
                      className="form-control"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="text"
                      name="startDate"
                      value={experienceInput.startDate}
                      onChange={handleExperienceChange}
                      className="form-control"
                      placeholder="Jan 2023"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="text"
                      name="endDate"
                      value={experienceInput.endDate}
                      onChange={handleExperienceChange}
                      className="form-control"
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={experienceInput.description}
                    onChange={handleExperienceChange}
                    className="form-control"
                    placeholder="Led development of microservices..."
                  />
                </div>
                <button onClick={addExperience} className="btn btn-secondary">Add Experience</button>
              </div>
            ) : (
              <div className="experience-list">
                {profile.experience.length > 0 ? (
                  profile.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <h4>{exp.role} at {exp.company}</h4>
                      <p>{exp.startDate} - {exp.endDate}</p>
                      <p>{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No experience added yet.</p>
                )}
              </div>
            )}
            {isEditing && profile.experience.length > 0 && (
              <div className="experience-list">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h4>{exp.role} at {exp.company}</h4>
                    <p>{exp.startDate} - {exp.endDate}</p>
                    <p>{exp.description}</p>
                    <button onClick={() => removeExperience(index)} className="btn btn-danger">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="profile-section">
            <h2>Projects</h2>
            {isEditing ? (
              <div className="project-form">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={projectInput.name}
                    onChange={handleProjectChange}
                    className="form-control"
                    placeholder="E-Commerce Platform"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={projectInput.description}
                    onChange={handleProjectChange}
                    className="form-control"
                    placeholder="Built a full-stack e-commerce platform..."
                  />
                </div>
                <div className="form-group">
                  <label>Technologies</label>
                  <input
                    type="text"
                    name="technologies"
                    value={projectInput.technologies}
                    onChange={handleProjectChange}
                    className="form-control"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>GitHub Link</label>
                    <input
                      type="text"
                      name="github"
                      value={projectInput.github}
                      onChange={handleProjectChange}
                      className="form-control"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Live Demo</label>
                    <input
                      type="text"
                      name="live"
                      value={projectInput.live}
                      onChange={handleProjectChange}
                      className="form-control"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button onClick={addProject} className="btn btn-secondary">Add Project</button>
              </div>
            ) : (
              <div className="project-list">
                {profile.projects.length > 0 ? (
                  profile.projects.map((proj, index) => (
                    <div key={index} className="project-item">
                      <h4>{proj.name}</h4>
                      <p>{proj.description}</p>
                      <p>Technologies: {proj.technologies}</p>
                      {proj.github && <p>GitHub: {proj.github}</p>}
                      {proj.live && <p>Live: {proj.live}</p>}
                    </div>
                  ))
                ) : (
                  <p>No projects added yet.</p>
                )}
              </div>
            )}
            {isEditing && profile.projects.length > 0 && (
              <div className="project-list">
                {profile.projects.map((proj, index) => (
                  <div key={index} className="project-item">
                    <h4>{proj.name}</h4>
                    <p>{proj.description}</p>
                    <p>Technologies: {proj.technologies}</p>
                    {proj.github && <p>GitHub: {proj.github}</p>}
                    {proj.live && <p>Live: {proj.live}</p>}
                    <button onClick={() => removeProject(index)} className="btn btn-danger">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
