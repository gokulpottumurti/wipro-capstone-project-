import React, { useState, useEffect } from "react";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../services/Api";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const res = await getProviders();
    setProviders(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await updateProvider(editId, form);
        setEditId(null);
      } else {
        await createProvider(form);
      }
      setForm({ name: "", email: "", phone: "", specialization: "", password: "" });
      fetchProviders();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
        console.error("Backend validation error:", err.response.data);
      } else {
        setError("Submission failed. Please try again.");
        console.error(err);
      }
    }
  };

  const handleEdit = (provider) => {
    setEditId(provider.id);
    setForm({
      name: provider.name || "",
      email: provider.email || "",
      phone: provider.phone || "",
      specialization: provider.specialization || "",
      password: "", // never prefill password
    });
  };

  const handleDelete = async (id) => {
    await deleteProvider(id);
    fetchProviders();
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div className="container">
        <div className="card shadow-lg p-4 rounded-4">
          <h2 className="text-center mb-4 text-primary fw-bold">
            Manage Providers
          </h2>

          {error && (
            <div className="alert alert-danger text-center py-2">
              Error: {JSON.stringify(error)}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="d-grid gap-3 mb-4"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <input
              type="text"
              name="name"
              className="form-control p-3 rounded-3"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              className="form-control p-3 rounded-3"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              className="form-control p-3 rounded-3"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="specialization"
              className="form-control p-3 rounded-3"
              placeholder="Specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-control p-3 rounded-3"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={!editId}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-pill py-2 px-4 fw-semibold shadow-sm"
            >
              {editId ? "Update Provider" : "Add Provider"}
            </button>
          </form>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.specialization}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2 rounded-pill"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDelete(p.id)}
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
    </div>
  );
};

export default Providers;