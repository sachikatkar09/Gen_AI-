import React from "react";
import { Link } from "react-router";

const MockInterview = () => {
  return (
    <main style={{ padding: "3rem", textAlign: "center" }}>
      <h1>Mock Interviews</h1>
      <p>Mock Interview feature coming soon!</p>
      <Link to="/dashboard">← Back to Dashboard</Link>
    </main>
  );
};

export default MockInterview;
