"use client"

import type React from "react"
import type { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useLocation } from "react-router-dom"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Dental Center</h2>
          <p>{user?.role} Dashboard</p>
        </div>

        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
          </li>

          {user?.role === "Admin" && (
            <>
              <li>
                <Link to="/patients" className={isActive("/patients") ? "active" : ""}>
                  <span className="nav-icon">👥</span>
                  Patients
                </Link>
              </li>
              <li>
                <Link to="/appointments" className={isActive("/appointments") ? "active" : ""}>
                  <span className="nav-icon">📅</span>
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/calendar" className={isActive("/calendar") ? "active" : ""}>
                  <span className="nav-icon">🗓️</span>
                  Calendar
                </Link>
              </li>
            </>
          )}

          {user?.role === "Patient" && (
            <li>
              <Link to="/patient-view" className={isActive("/patient-view") ? "active" : ""}>
                <span className="nav-icon">👤</span>
                My Records
              </Link>
            </li>
          )}
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            <p>{user?.email}</p>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  )
}

export default Layout
