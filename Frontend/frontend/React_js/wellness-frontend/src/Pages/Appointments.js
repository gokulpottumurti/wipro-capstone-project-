import React, { useEffect, useState } from "react";
import {
  getAllPatients,
  getProviders,
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../services/Api";
import "bootstrap/dist/css/bootstrap.min.css";

const AppointmentBooking = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    patient_id: "",
    provider_id: "",
    appointment_date: "",
    notes: "",
    status: "PENDING",
  });
  const [loading, setLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, providersRes] = await Promise.all([
          getAllPatients(),
          getProviders(),
        ]);
        setPatients(patientsRes.data);
        setProviders(providersRes.data);
      } catch (err) {
        setError("Failed to load patients or providers.");
      }
    };
    fetchData();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    setError(null);
    try {
      const res = await getAppointments();
      setAppointments(res.data);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearForm = () => {
    setForm({
      id: null,
      patient_id: "",
      provider_id: "",
      appointment_date: "",
      notes: "",
      status: "PENDING",
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        appointmentDate: form.appointment_date,
        notes: form.notes,
        status: form.status,
        patient: { id: Number(form.patient_id) },
        provider: { id: Number(form.provider_id) },
      };

      if (form.id) {
        await updateAppointment(form.id, payload);
        setSuccess("Appointment updated successfully!");
      } else {
        await createAppointment(payload);
        setSuccess("Appointment booked successfully!");
      }

      clearForm();
      fetchAppointments();
    } catch {
      setError("Failed to save appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appt) => {
    setForm({
      id: appt.id,
      patient_id: appt.patient?.id || "",
      provider_id: appt.provider?.id || "",
      appointment_date: appt.appointmentDate ? appt.appointmentDate.slice(0, 16) : "",
      notes: appt.notes || "",
      status: appt.status || "PENDING",
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    setLoading(true);
    try {
      await deleteAppointment(id);
      setSuccess("Appointment deleted.");
      if (form.id === id) clearForm();
      fetchAppointments();
    } catch {
      setError("Failed to delete appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      await updateAppointment(id, { status: newStatus });
      setSuccess("Status updated successfully!");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">{form.id ? "Edit Appointment" : "Book Appointment"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="patient_id" className="form-label">
              Patient
            </label>
            <select
              id="patient_id"
              name="patient_id"
              value={form.patient_id}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a patient</option>
              {patients.length > 0
                ? patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </option>
                  ))
                : <option disabled>No patients found</option>}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="provider_id" className="form-label">
              Provider
            </label>
            <select
              id="provider_id"
              name="provider_id"
              value={form.provider_id}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a provider</option>
              {providers.length > 0
                ? providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.specialization})
                    </option>
                  ))
                : <option disabled>No providers found</option>}
            </select>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="appointment_date" className="form-label">
              Appointment Date
            </label>
            <input
              type="datetime-local"
              id="appointment_date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes"
            className="form-control"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary me-2"
        >
          {loading
            ? form.id
              ? "Updating..."
              : "Booking..."
            : form.id
            ? "Update Appointment"
            : "Book Appointment"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={clearForm}
            className="btn btn-secondary"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <hr />

      <h3>Appointments List</h3>
      {loadingAppointments ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Patient</th>
                <th>Provider</th>
                <th>Appointment Date</th>
                <th>Notes</th>
                <th>Status</th>
                <th style={{ minWidth: "130px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patient?.name || "Unknown"}</td>
                  <td>{appt.provider?.name || "Unknown"}</td>
                  <td>{new Date(appt.appointmentDate).toLocaleString()}</td>
                  <td>{appt.notes || "-"}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      disabled={loading}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(appt)}
                      disabled={loading}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appt.id)}
                      disabled={loading}
                      className="btn btn-sm btn-outline-danger"
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
  );
};

export default AppointmentBooking;
