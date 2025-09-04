import React, { useState, useEffect } from "react";
import {
  getWellnessServices,
  createWellnessService,
  updateWellnessService,
  deleteWellnessService,
} from "../services/Api";

const WellnessServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    duration: "",
    fee: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await getWellnessServices();
    setServices(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.serviceName,
      description: form.description,
      duration: form.duration,
      fee: form.fee,
    };
    if (editId) {
      await updateWellnessService(editId, payload);
      setEditId(null);
    } else {
      await createWellnessService(payload);
    }
    setForm({ serviceName: "", description: "", duration: "", fee: "" });
    fetchServices();
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setForm({
      serviceName: service.name || "",
      description: service.description || "",
      duration: service.duration || "",
      fee: service.fee || "",
    });
  };

  const handleDelete = async (id) => {
    await deleteWellnessService(id);
    fetchServices();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6f7ff, #f0fff4)",
        padding: "3rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "800",
            fontSize: "2rem",
            marginBottom: "2rem",
            background: "linear-gradient(90deg, #0d6efd, #198754)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Wellness Services Management
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            marginBottom: "2rem",
          }}
        >
          <input
            type="text"
            name="serviceName"
            placeholder="Service Name"
            value={form.serviceName}
            onChange={handleChange}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (days/weeks)"
            value={form.duration}
            onChange={handleChange}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            step="0.01"
            name="fee"
            placeholder="Fee"
            value={form.fee}
            onChange={handleChange}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              gridColumn: "1 / -1",
              padding: "0.9rem 1.5rem",
              border: "none",
              borderRadius: "50px",
              background: "#0d6efd",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
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
            {editId ? "Update Service" : "Create Service"}
          </button>
        </form>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#0d6efd", color: "#fff" }}>
              <tr>
                <th style={{ padding: "1rem" }}>ID</th>
                <th style={{ padding: "1rem" }}>Service Name</th>
                <th style={{ padding: "1rem" }}>Description</th>
                <th style={{ padding: "1rem" }}>Duration</th>
                <th style={{ padding: "1rem" }}>Fee</th>
                <th style={{ padding: "1rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr
                  key={s.id}
                  style={{
                    background: i % 2 === 0 ? "#f8f9fa" : "#fff",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "0.9rem" }}>{s.id}</td>
                  <td style={{ padding: "0.9rem" }}>{s.name}</td>
                  <td style={{ padding: "0.9rem" }}>{s.description}</td>
                  <td style={{ padding: "0.9rem" }}>{s.duration}</td>
               <td style={{ padding: "0.9rem" }}>₹{s.fee}</td>

                  <td style={{ padding: "0.9rem" }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(s)}
                      style={{
                        marginRight: "0.5rem",
                        padding: "0.4rem 0.8rem",
                        border: "none",
                        borderRadius: "6px",
                        background: "#198754",
                        color: "#fff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#146c43")}
                      onMouseLeave={(e) => (e.target.style.background = "#198754")}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: "none",
                        borderRadius: "6px",
                        background: "#dc3545",
                        color: "#fff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#a71d2a")}
                      onMouseLeave={(e) => (e.target.style.background = "#dc3545")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WellnessServices;