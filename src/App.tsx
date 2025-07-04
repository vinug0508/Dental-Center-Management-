import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { DataProvider } from "./contexts/DataContext"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import PatientManagement from "./components/PatientManagement"
import AppointmentManagement from "./components/AppointmentManagement"
import Calendar from "./components/Calendar"
import PatientView from "./components/PatientView"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute adminOnly>
                    <Layout>
                      <PatientManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute adminOnly>
                    <Layout>
                      <AppointmentManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute adminOnly>
                    <Layout>
                      <Calendar />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient-view"
                element={
                  <ProtectedRoute patientOnly>
                    <Layout>
                      <PatientView />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
