import React, { useEffect, useState } from "react";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getAllPatients,
  getAppointments,
  getWellnessServices,
} from "../services/Api";

const PaymentsCRUD = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    id: null,
    patientId: "",
    appointmentId: "",
    serviceId: "",
    paymentStatus: "PENDING",
    paymentDate: "",
    transactionId: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchDropdownData();
    fetchPayments();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [patientsRes, appointmentsRes, servicesRes] = await Promise.all([
        getAllPatients(),
        getAppointments(),
        getWellnessServices(),
      ]);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setServices(servicesRes.data);
    } catch (e) {
      console.error("Failed to load dropdown data", e);
    }
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    setError(null);
    try {
      const res = await getPayments();
      setPayments(res.data);
    } catch (err) {
      setError("Failed to load payments.");
      console.error(err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const clearForm = () => {
    setForm({
      id: null,
      patientId: "",
      appointmentId: "",
      serviceId: "",
      paymentStatus: "PENDING",
      paymentDate: "",
      transactionId: "",
      amount: "",
    });
    setError(null);
    setSuccess(null);
  };

  const generateTransactionId = () => {
    return "TXN-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
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
        appointmentId: Number(form.appointmentId),
        serviceId: Number(form.serviceId),
        paymentStatus: form.paymentStatus,
        paymentDate: form.paymentDate ? new Date(form.paymentDate) : new Date(),
        transactionId: form.id ? form.transactionId : generateTransactionId(),
        amount: Number(form.amount),
      };

      if (isNaN(payload.amount) || payload.amount <= 0) {
        setError("Amount is required and must be a positive number.");
        setLoading(false);
        return;
      }

      if (form.id) {
        await updatePayment(form.id, payload);
        setSuccess("Payment updated successfully!");
      } else {
        await createPayment(payload);
        setSuccess("Payment created successfully!");
      }

      clearForm();
      fetchPayments();
    } catch (err) {
      setError("Failed to save payment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment) => {
    setForm({
      id: payment.id,
      patientId: payment.patient?.id || payment.patientId || "",
      appointmentId: payment.appointment?.id || payment.appointmentId || "",
      serviceId: payment.service?.id || payment.serviceId || "",
      paymentStatus: payment.paymentStatus || "PENDING",
      paymentDate: payment.paymentDate ? payment.paymentDate.substring(0, 16) : "",
      transactionId: payment.transactionId || "",
      amount: payment.amount || "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this payment?")) return;

    setLoading(true);
    try {
      await deletePayment(id);
      setSuccess("Payment deleted.");
      if (form.id === id) clearForm();
      fetchPayments();
    } catch (err) {
      setError("Failed to delete payment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #00b4d8, #48cae4, #90e0ef)",
      padding: "2rem",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#023e8a", marginBottom: "1rem" }}>
          {form.id ? "Edit Payment" : "New Payment"}
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

        <div style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <select name="patientId" value={form.patientId} onChange={handleChange} required>
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>

            <select name="appointmentId" value={form.appointmentId} onChange={handleChange} required>
              <option value="">Select an appointment</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.appointmentDate} - {a.status}
                </option>
              ))}
            </select>

            <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} required>
              <option value="PENDING">PENDING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>

            <input type="datetime-local" name="paymentDate" value={form.paymentDate} onChange={handleChange} />

            <input
              type="number"
              step="0.01"
              name="amount"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={handleChange}
              required
              min="0.01"
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(to right, #0077b6, #0096c7)",
                color: "#fff",
                padding: "0.8rem",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? (form.id ? "Updating..." : "Creating...") : form.id ? "Update Payment" : "Create Payment"}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={clearForm}
                style={{
                  background: "#ccc",
                  padding: "0.8rem",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <h3 style={{ textAlign: "center", color: "#03045e", marginBottom: "1rem" }}>Payments List</h3>

        {loadingPayments ? (
          <p style={{ textAlign: "center" }}>Loading payments...</p>
        ) : payments.length === 0 ? (
          <p style={{ textAlign: "center" }}>No payments found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}>
              <thead style={{ background: "#0077b6", color: "#fff" }}>
                <tr>
                  <th style={{ padding: "0.8rem" }}>ID</th>
                  <th style={{ padding: "0.8rem" }}>Patient</th>
                  <th style={{ padding: "0.8rem" }}>Email</th>
                  <th style={{ padding: "0.8rem" }}>Appointment Date</th>
                  <th style={{ padding: "0.8rem" }}>Status</th>
                  <th style={{ padding: "0.8rem" }}>Service</th>
                  <th style={{ padding: "0.8rem" }}>Payment Status</th>
                  <th style={{ padding: "0.8rem" }}>Payment Date</th>
                  <th style={{ padding: "0.8rem" }}>Transaction ID</th>
                  <th style={{ padding: "0.8rem" }}>Amount (₹)</th>
                  <th style={{ padding: "0.8rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr key={payment.id} style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                    <td style={{ padding: "0.8rem", textAlign: "center" }}>{payment.id}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.patient?.name || payment.patientId || "N/A"}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.patient?.email || "N/A"}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.appointment?.appointmentDate || payment.appointmentId || "N/A"}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.appointment?.status || "N/A"}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.service?.name || payment.serviceId || "N/A"}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.paymentStatus}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "N/A"}</td>
                    <td style={{ padding: "0.8rem" }}>{payment.transactionId}</td>
                    <td style={{ padding: "0.8rem" }}>₹{payment.amount?.toFixed(2) || "0.00"}</td>
                    <td style={{ padding: "0.8rem" }}>
                      <button
                        onClick={() => handleEdit(payment)}
                        disabled={loading}
                        style={{
                          marginRight: "0.5rem",
                          background: "#0096c7",
                          color: "#fff",
                          padding: "0.4rem 0.8rem",
                          border: "none",
                          borderRadius: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        disabled={loading}
                        style={{
                          background: "#d90429",
                          color: "#fff",
                          padding: "0.4rem 0.8rem",
                          border: "none",
                          borderRadius: "12px",
                          cursor: "pointer",
                        }}
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

export default PaymentsCRUD;
