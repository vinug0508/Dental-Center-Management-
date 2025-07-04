"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"

const PatientView: React.FC = () => {
  const { user } = useAuth()
  const { incidents, patients } = useData()

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents.filter((i) => i.patientId === user?.patientId)

  const upcomingAppointments = patientIncidents
    .filter((i) => new Date(i.appointmentDate) > new Date())
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

  const pastAppointments = patientIncidents
    .filter((i) => new Date(i.appointmentDate) <= new Date())
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const totalCost = patientIncidents
    .filter((i) => i.cost && i.status === "Completed")
    .reduce((total, i) => total + (i.cost || 0), 0)

  if (!patient) {
    return (
      <div className="patient-view">
        <div className="error-message">Patient information not found. Please contact the dental office.</div>
      </div>
    )
  }

  return (
    <div className="patient-view">
      <div className="patient-header">
        <h1>My Dental Records</h1>
        <div className="patient-info-card">
          <h2>{patient.name}</h2>
          <div className="patient-details">
            <p>
              <strong>Date of Birth:</strong> {new Date(patient.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Contact:</strong> {patient.contact}
            </p>
            <p>
              <strong>Email:</strong> {patient.email}
            </p>
            <p>
              <strong>Health Information:</strong> {patient.healthInfo}
            </p>
          </div>
        </div>
      </div>

      <div className="patient-stats">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <div className="stat-number">{patientIncidents.length}</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming</h3>
          <div className="stat-number">{upcomingAppointments.length}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">{patientIncidents.filter((i) => i.status === "Completed").length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Cost</h3>
          <div className="stat-number">${totalCost}</div>
        </div>
      </div>

      <div className="appointments-sections">
        <div className="appointments-section">
          <h2>Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card detailed">
                  <div className="appointment-header">
                    <h3>{appointment.title}</h3>
                    <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                  </div>
                  <div className="appointment-details">
                    <p>
                      <strong>Description:</strong> {appointment.description}
                    </p>
                    {appointment.comments && (
                      <p>
                        <strong>Comments:</strong> {appointment.comments}
                      </p>
                    )}
                    <p>
                      <strong>Date & Time:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                      {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {appointment.nextDate && (
                      <p>
                        <strong>Next Appointment:</strong> {new Date(appointment.nextDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No upcoming appointments</p>
          )}
        </div>

        <div className="appointments-section">
          <h2>Appointment History</h2>
          {pastAppointments.length > 0 ? (
            <div className="appointments-list">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card detailed">
                  <div className="appointment-header">
                    <h3>{appointment.title}</h3>
                    <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                  </div>
                  <div className="appointment-details">
                    <p>
                      <strong>Description:</strong> {appointment.description}
                    </p>
                    {appointment.comments && (
                      <p>
                        <strong>Comments:</strong> {appointment.comments}
                      </p>
                    )}
                    <p>
                      <strong>Date & Time:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                      {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {appointment.treatment && (
                      <p>
                        <strong>Treatment:</strong> {appointment.treatment}
                      </p>
                    )}
                    {appointment.cost && (
                      <p>
                        <strong>Cost:</strong> ${appointment.cost}
                      </p>
                    )}
                    {appointment.files && appointment.files.length > 0 && (
                      <div className="appointment-files">
                        <strong>Files:</strong>
                        <div className="file-list">
                          {appointment.files.map((file, index) => (
                            <div key={index} className="file-item">
                              <a href={file.url} download={file.name} className="file-link">
                                📎 {file.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No appointment history</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientView
