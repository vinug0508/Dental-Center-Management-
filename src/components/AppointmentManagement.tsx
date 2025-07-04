"use client"

import type React from "react"
import { useState } from "react"
import { useData } from "../contexts/DataContext"

const AppointmentManagement: React.FC = () => {
  const { incidents, patients, addIncident, updateIncident, deleteIncident, uploadFile } = useData()

  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    patientId: "",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    treatment: "",
    status: "Scheduled" as "Scheduled" | "Completed" | "Cancelled",
    nextDate: "",
  })
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const uploadedFiles = await Promise.all(files.map((file) => uploadFile(file)))

    const incidentData = {
      ...formData,
      cost: formData.cost ? Number.parseFloat(formData.cost) : undefined,
      files: uploadedFiles,
    }

    if (editingIncident) {
      updateIncident(editingIncident, incidentData)
      setEditingIncident(null)
    } else {
      addIncident(incidentData)
    }

    resetForm()
  }

  const handleEdit = (incident: any) => {
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments,
      appointmentDate: incident.appointmentDate.slice(0, 16),
      cost: incident.cost?.toString() || "",
      treatment: incident.treatment || "",
      status: incident.status,
      nextDate: incident.nextDate?.slice(0, 16) || "",
    })
    setEditingIncident(incident.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteIncident(id)
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
      treatment: "",
      status: "Scheduled",
      nextDate: "",
    })
    setFiles([])
    setEditingIncident(null)
    setShowForm(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className="appointment-management">
      <div className="page-header">
        <h1>Appointment Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Schedule New Appointment
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>{editingIncident ? "Edit Appointment" : "Schedule New Appointment"}</h2>
              <button className="close-button" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientId">Patient</label>
                  <select
                    id="patientId"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="comments">Comments</label>
                <textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointmentDate">Appointment Date & Time</label>
                  <input
                    type="datetime-local"
                    id="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nextDate">Next Appointment (Optional)</label>
                  <input
                    type="datetime-local"
                    id="nextDate"
                    value={formData.nextDate}
                    onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cost">Cost ($)</label>
                  <input
                    type="number"
                    id="cost"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="treatment">Treatment</label>
                  <input
                    type="text"
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="files">Upload Files (Invoices, X-rays, etc.)</label>
                <input type="file" id="files" onChange={handleFileChange} multiple accept="image/*,.pdf,.doc,.docx" />
                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((file, index) => (
                      <span key={index} className="file-item">
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIncident ? "Update" : "Schedule"} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Title</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Cost</th>
              <th>Treatment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => {
              const patient = patients.find((p) => p.id === incident.patientId)
              return (
                <tr key={incident.id}>
                  <td>{patient?.name || "Unknown"}</td>
                  <td>{incident.title}</td>
                  <td>
                    {new Date(incident.appointmentDate).toLocaleDateString()}
                    <br />
                    {new Date(incident.appointmentDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <span className={`status ${incident.status.toLowerCase()}`}>{incident.status}</span>
                  </td>
                  <td>{incident.cost ? `$${incident.cost}` : "N/A"}</td>
                  <td>{incident.treatment || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(incident)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(incident.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppointmentManagement
