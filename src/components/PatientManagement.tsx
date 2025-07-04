"use client"

import type React from "react"
import { useState } from "react"
import { useData } from "../contexts/DataContext"

const PatientManagement: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPatient) {
      updatePatient(editingPatient, formData)
      setEditingPatient(null)
    } else {
      addPatient(formData)
    }
    setFormData({ name: "", dob: "", contact: "", healthInfo: "", email: "" })
    setShowForm(false)
  }

  const handleEdit = (patient: any) => {
    setFormData({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      healthInfo: patient.healthInfo,
      email: patient.email || "",
    })
    setEditingPatient(patient.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      deletePatient(id)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", dob: "", contact: "", healthInfo: "", email: "" })
    setEditingPatient(null)
    setShowForm(false)
  }

  return (
    <div className="patient-management">
      <div className="page-header">
        <h1>Patient Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add New Patient
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingPatient ? "Edit Patient" : "Add New Patient"}</h2>
              <button className="close-button" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="patient-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="healthInfo">Health Information</label>
                <textarea
                  id="healthInfo"
                  value={formData.healthInfo}
                  onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPatient ? "Update" : "Add"} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="patients-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Health Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{new Date(patient.dob).toLocaleDateString()}</td>
                <td>{patient.contact}</td>
                <td>{patient.email || "N/A"}</td>
                <td>{patient.healthInfo}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(patient)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(patient.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PatientManagement
