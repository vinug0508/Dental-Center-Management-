"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = login(email, password)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dental Center Management</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Credentials:</h3>
          <p>
            <strong>Admin:</strong> admin@entnt.in / admin123
          </p>
          <p>
            <strong>Patient:</strong> john@entnt.in / patient123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
