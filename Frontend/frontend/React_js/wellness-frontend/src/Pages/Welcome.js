import React from "react";

const Welcome = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "linear-gradient(135deg, #e6f7ff, #f0fff4)",
      padding: "2rem",
    }}
  >
    {/* Hero Section */}
    <h1
      style={{
        fontSize: "3rem",
        fontWeight: "800",
        background: "linear-gradient(90deg, #0d6efd, #198754)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "1rem",
      }}
    >
      Healthcare & Wellness Management System
    </h1>
    <p
      style={{
        fontSize: "1.25rem",
        color: "#444",
        maxWidth: "650px",
        margin: "0 auto 2rem auto",
        lineHeight: "1.6",
      }}
    >
      Your trusted platform to manage patients, book appointments, and access
      wellness services—all in one place.
    </p>

    {/* CTA Buttons */}
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
      <a
        href="/register"
        style={{
          background: "#0d6efd",
          color: "#fff",
          padding: "0.8rem 2rem",
          borderRadius: "50px",
          fontWeight: "600",
          textDecoration: "none",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#0056b3";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#0d6efd";
          e.target.style.transform = "scale(1)";
        }}
      >
        Get Started
      </a>

      <a
        href="/appointments"
        style={{
          background: "#fff",
          color: "#0d6efd",
          padding: "0.8rem 2rem",
          borderRadius: "50px",
          fontWeight: "600",
          textDecoration: "none",
          border: "2px solid #0d6efd",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#0d6efd";
          e.target.style.color = "#fff";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#fff";
          e.target.style.color = "#0d6efd";
          e.target.style.transform = "scale(1)";
        }}
      >
        Book Appointment
      </a>
    </div>

    {/* Features Section */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "2rem",
        maxWidth: "900px",
        width: "100%",
      }}
    >
      <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧑‍⚕️</div>
        <h3 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Patient Management</h3>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Keep track of patient records, history, and treatment plans effortlessly.
        </p>
      </div>

      <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
        <h3 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Appointments</h3>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Schedule, manage, and remind patients of their upcoming appointments.
        </p>
      </div>

      <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌿</div>
        <h3 style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Wellness Services</h3>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Access holistic wellness programs to improve overall health and wellbeing.
        </p>
      </div>
    </div>
  </div>
);

export default Welcome;