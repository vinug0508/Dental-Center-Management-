"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  const getUpcomingAppointments = () => {
    const now = new Date()
    return incidents
      .filter((i) => new Date(i.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 10)
  }

  const getTopPatients = () => {
    const patientIncidentCount = patients.map((patient) => ({
      ...patient,
      incidentCount: incidents.filter((i) => i.patientId === patient.id).length,
    }))
    return patientIncidentCount.sort((a, b) => b.incidentCount - a.incidentCount).slice(0, 5)
  }

  const getTotalRevenue = () => {
    return incidents.filter((i) => i.cost && i.status === "Completed").reduce((total, i) => total + (i.cost || 0), 0)
  }

  const getStatusCounts = () => {
    const completed = incidents.filter((i) => i.status === "Completed").length
    const scheduled = incidents.filter((i) => i.status === "Scheduled").length
    const cancelled = incidents.filter((i) => i.status === "Cancelled").length
    return { completed, scheduled, cancelled }
  }

  const upcomingAppointments = getUpcomingAppointments()
  const topPatients = getTopPatients()
  const totalRevenue = getTotalRevenue()
  const statusCounts = getStatusCounts()

  if (user?.role === "Patient") {
    const patientIncidents = incidents.filter((i) => i.patientId === user.patientId)
    const upcomingPatientAppointments = patientIncidents
      .filter((i) => new Date(i.appointmentDate) > new Date())
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome Back!</h1>
          <p>Here's your appointment overview</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Appointments</h3>
            <div className="stat-number">{patientIncidents.length}</div>
          </div>
          <div className="stat-card">
            <h3>Upcoming</h3>
            <div className="stat-number">{upcomingPatientAppointments.length}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="stat-number">{patientIncidents.filter((i) => i.status === "Completed").length}</div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Upcoming Appointments</h2>
          <div className="appointments-list">
            {upcomingPatientAppointments.length > 0 ? (
              upcomingPatientAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h4>{appointment.title}</h4>
                    <p>{appointment.description}</p>
                    <div className="appointment-meta">
                      <span className="appointment-date">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Dr. {user?.email?.split("@")[0]}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <div className="stat-number">{patients.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-number">${totalRevenue}</div>
        </div>
        <div className="stat-card">
          <h3>Completed Treatments</h3>
          <div className="stat-number">{statusCounts.completed}</div>
        </div>
        <div className="stat-card">
          <h3>Scheduled Appointments</h3>
          <div className="stat-number">{statusCounts.scheduled}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Next 10 Appointments</h2>
          <div className="appointments-list">
            {upcomingAppointments.map((appointment) => {
              const patient = patients.find((p) => p.id === appointment.patientId)
              return (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h4>{appointment.title}</h4>
                    <p>
                      <strong>Patient:</strong> {patient?.name}
                    </p>
                    <div className="appointment-meta">
                      <span className="appointment-date">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Top Patients</h2>
          <div className="patients-list">
            {topPatients.map((patient) => (
              <div key={patient.id} className="patient-card">
                <div className="patient-info">
                  <h4>{patient.name}</h4>
                  <p>{patient.contact}</p>
                  <span className="appointment-count">{patient.incidentCount} appointments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
