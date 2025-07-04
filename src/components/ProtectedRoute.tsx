"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
  patientOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, patientOnly = false }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== "Admin") {
    return <Navigate to="/" replace />
  }

  if (patientOnly && user?.role !== "Patient") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
