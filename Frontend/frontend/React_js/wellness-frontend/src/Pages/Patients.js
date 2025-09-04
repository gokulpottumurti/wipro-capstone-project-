import React, { useState, useEffect } from "react";
import {
  registerPatient,
  loginPatient,
  getPatientById,
  updatePatientProfile,
  getHealthRecords,
  updateHealthRecords,
} from "../services/Api";

// -------------------- STYLES --------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb", // gray-50
    padding: "2.5rem 1rem",
  },
  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  heading: {
    fontSize: "2.25rem",
    fontWeight: "800",
    textAlign: "center",
    color: "#111827", // gray-900
  },
  card: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937", // gray-800
  },
  input: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    padding: "0.6rem 0.8rem",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s",
  },
  textarea: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    padding: "0.6rem 0.8rem",
    fontSize: "1rem",
    minHeight: "120px",
    resize: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "1rem",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  btnPrimary: {
    background: "linear-gradient(to right, #6366f1, #2563eb)", // indigo → blue
  },
  btnSuccess: {
    background: "linear-gradient(to right, #22c55e, #059669)", // green → emerald
  },
  btnInfo: {
    background: "linear-gradient(to right, #10b981, #0d9488)", // emerald → teal
  },
};

// -------------------- COMPONENT --------------------
const Patients = () => {
  const [patientId, setPatientId] = useState(null);
  const [token, setToken] = useState("");
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });
  const [healthRecords, setHealthRecords] = useState("");

  const fetchPatient = async () => {
    if (!patientId || !token) return;
    try {
      const response = await getPatientById(patientId, token);
      setPatient(response.data);
      const recordsRes = await getHealthRecords(patientId, token);
      setHealthRecords(recordsRes.data.records);
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId, token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerPatient(patient);
      alert("Patient registered successfully! ID: " + response.data.id);
      setPatientId(response.data.id);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginPatient({
        email: patient.email,
        password: patient.password,
      });
      setToken(response.data.token);
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await updatePatientProfile(patientId, patient, token);
      setPatient(response.data);
      alert("Profile updated!");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleUpdateHealthRecords = async () => {
    try {
      const response = await updateHealthRecords(patientId, healthRecords, token);
      setHealthRecords(response.data.healthRecords);
      alert("Health records updated!");
    } catch (error) {
      console.error("Health record update error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={styles.heading}>Patient Management</h2>

        {/* Register */}
        <form onSubmit={handleRegister} style={styles.card}>
          <h3 style={styles.cardTitle}>Register</h3>
          <input
            style={styles.input}
            placeholder="Name"
            value={patient.name}
            onChange={(e) => setPatient({ ...patient, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Email"
            value={patient.email}
            onChange={(e) => setPatient({ ...patient, email: e.target.value })}
          />
          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            onChange={(e) => setPatient({ ...patient, password: e.target.value })}
          />
          <button
            type="submit"
            style={{ ...styles.button, ...styles.btnPrimary }}
          >
            Register
          </button>
        </form>

        {/* Login */}
        <form onSubmit={handleLogin} style={styles.card}>
          <h3 style={styles.cardTitle}>Login</h3>
          <input
            style={styles.input}
            placeholder="Email"
            value={patient.email}
            onChange={(e) => setPatient({ ...patient, email: e.target.value })}
          />
          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            onChange={(e) => setPatient({ ...patient, password: e.target.value })}
          />
          <button
            type="submit"
            style={{ ...styles.button, ...styles.btnSuccess }}
          >
            Login
          </button>
        </form>

        {/* Profile */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Profile</h3>
          <input
            style={styles.input}
            placeholder="Name"
            value={patient.name}
            onChange={(e) => setPatient({ ...patient, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Phone"
            value={patient.phone}
            onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Address"
            value={patient.address}
            onChange={(e) => setPatient({ ...patient, address: e.target.value })}
          />
          <input
            type="date"
            style={styles.input}
            placeholder="DOB"
            value={patient.dob || ""}
            onChange={(e) => setPatient({ ...patient, dob: e.target.value })}
          />
          <button
            onClick={handleUpdateProfile}
            style={{ ...styles.button, ...styles.btnPrimary }}
          >
            Update Profile
          </button>
        </div>

        {/* Health Records */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Health Records</h3>
          <textarea
            style={styles.textarea}
            value={healthRecords}
            onChange={(e) => setHealthRecords(e.target.value)}
          />
          <button
            onClick={handleUpdateHealthRecords}
            style={{ ...styles.button, ...styles.btnInfo }}
          >
            Update Health Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default Patients;
