import React, { useEffect, useState } from "react";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getAllPatients,
  getWellnessServices,
} from "../services/Api";

// -------------------- STYLE OBJECT --------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#1f2937",
  },
  formGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "0.25rem",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s",
  },
  select: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    padding: "0.6rem 1rem",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "1rem",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s",
    marginRight: "0.5rem",
  },
  btnPrimary: {
    background: "linear-gradient(to right, #6366f1, #2563eb)",
  },
  btnDanger: {
    background: "linear-gradient(to right, #ef4444, #b91c1c)",
  },
  btnSecondary: {
    background: "linear-gradient(to right, #9ca3af, #6b7280)",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    background: "#f3f4f6",
    textAlign: "left",
    padding: "0.75rem",
    borderBottom: "2px solid #e5e7eb",
    fontWeight: "600",
    color: "#374151",
  },
  td: {
    padding: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },
  trHover: {
    background: "#f9fafb",
  },
  message: {
    marginTop: "1rem",
    fontWeight: "600",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
};

// -------------------- COMPONENT --------------------
const EnrollmentsCRUD = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    id: null,
    patientId: "",
    serviceId: "",
    startDate: "",
    endDate: "",
    progress: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingEnrollments(true);
      try {
        const [enrRes, patRes, serRes] = await Promise.all([
          getEnrollments(),
          getAllPatients(),
          getWellnessServices(),
        ]);
        setEnrollments(enrRes.data);
        setPatients(patRes.data);
        setServices(serRes.data);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchInitialData();
  }, []);

  const clearForm = () => {
    setForm({
      id: null,
      patientId: "",
      serviceId: "",
      startDate: "",
      endDate: "",
      progress: 0,
    });
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        patientId: Number(form.patientId),
        serviceId: Number(form.serviceId),
        startDate: form.startDate,
        endDate: form.endDate,
        progress: form.progress,
      };

      if (form.id) {
        await updateEnrollment(form.id, payload);
        setSuccess("Enrollment updated successfully!");
      } else {
        await createEnrollment(payload);
        setSuccess("Enrollment created successfully!");
      }

      clearForm();
      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError("Failed to save enrollment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (enroll) => {
    setForm({
      id: enroll.id,
      patientId: enroll.patientId || "",
      serviceId: enroll.serviceId || "",
      startDate: enroll.startDate || "",
      endDate: enroll.endDate || "",
      progress: enroll.progress || 0,
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this enrollment?")) return;
    setLoading(true);
    try {
      await deleteEnrollment(id);
      setSuccess("Enrollment deleted.");
      if (form.id === id) clearForm();
      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError("Failed to delete enrollment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* FORM */}
      <div style={styles.card}>
        <h2 style={styles.heading}>
          {form.id ? "Edit Enrollment" : "New Enrollment"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Patient</label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Wellness Service</label>
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Progress (%)</label>
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={form.progress}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, ...styles.btnPrimary }}
          >
            {loading
              ? form.id
                ? "Updating..."
                : "Creating..."
              : form.id
              ? "Update Enrollment"
              : "Create Enrollment"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={clearForm}
              style={{ ...styles.button, ...styles.btnSecondary }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        {success && (
          <p style={{ ...styles.message, ...styles.success }}>{success}</p>
        )}
        {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <h3 style={styles.heading}>Enrollments List</h3>
        {loadingEnrollments ? (
          <p>Loading enrollments...</p>
        ) : enrollments.length === 0 ? (
          <p>No enrollments found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Start Date</th>
                  <th style={styles.th}>End Date</th>
                  <th style={styles.th}>Progress</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enroll, idx) => (
                  <tr
                    key={enroll.id}
                    style={
                      idx % 2 === 0 ? {} : { backgroundColor: "#f9fafb" }
                    }
                  >
                    <td style={styles.td}>{enroll.id}</td>
                    <td style={styles.td}>{enroll.patient?.name}</td>
                    <td style={styles.td}>{enroll.service?.name}</td>
                    <td style={styles.td}>{enroll.startDate}</td>
                    <td style={styles.td}>{enroll.endDate}</td>
                    <td style={styles.td}>{enroll.progress}%</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(enroll)}
                        disabled={loading}
                        style={{ ...styles.button, ...styles.btnPrimary }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(enroll.id)}
                        disabled={loading}
                        style={{ ...styles.button, ...styles.btnDanger }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsCRUD;
