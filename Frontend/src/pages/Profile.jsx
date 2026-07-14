import React from "react";
import { Link } from "react-router";

const Profile = () => {
  return (
    <main style={{ padding: "3rem", textAlign: "center" }}>
      <h1>User Profile</h1>
      <p>Profile feature coming soon!</p>
      <Link to="/dashboard">← Back to Dashboard</Link>
    </main>
  );
};

export default Profile;
