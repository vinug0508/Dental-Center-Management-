"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Patient {
  id: string
  name: string
  dob: string
  contact: string
  healthInfo: string
  email?: string
}

interface FileAttachment {
  name: string
  url: string
  type: string
}

interface Incident {
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost?: number
  treatment?: string
  status: "Scheduled" | "Completed" | "Cancelled"
  nextDate?: string
  files: FileAttachment[]
}

interface DataContextType {
  patients: Patient[]
  incidents: Incident[]
  addPatient: (patient: Omit<Patient, "id">) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  addIncident: (incident: Omit<Incident, "id">) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void
  deleteIncident: (id: string) => void
  getPatientIncidents: (patientId: string) => Incident[]
  uploadFile: (file: File) => Promise<FileAttachment>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const initialPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No allergies",
    email: "john@entnt.in",
  },
  {
    id: "p2",
    name: "Jane Smith",
    dob: "1985-08-15",
    contact: "0987654321",
    healthInfo: "Allergic to penicillin",
    email: "jane@entnt.in",
  },
]

const initialIncidents: Incident[] = [
  {
    id: "i1",
    patientId: "p1",
    title: "Toothache",
    description: "Upper molar pain",
    comments: "Sensitive to cold",
    appointmentDate: "2025-01-15T10:00:00",
    cost: 80,
    treatment: "Root canal treatment",
    status: "Completed",
    files: [],
  },
  {
    id: "i2",
    patientId: "p1",
    title: "Regular Checkup",
    description: "Routine dental examination",
    comments: "Good oral hygiene",
    appointmentDate: "2025-01-20T14:00:00",
    status: "Scheduled",
    files: [],
  },
  {
    id: "i3",
    patientId: "p2",
    title: "Teeth Cleaning",
    description: "Professional dental cleaning",
    comments: "Plaque buildup",
    appointmentDate: "2025-01-18T09:00:00",
    cost: 60,
    treatment: "Deep cleaning",
    status: "Completed",
    files: [],
  },
]

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const savedPatients = localStorage.getItem("patients")
    const savedIncidents = localStorage.getItem("incidents")

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    } else {
      setPatients(initialPatients)
      localStorage.setItem("patients", JSON.stringify(initialPatients))
    }

    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents))
    } else {
      setIncidents(initialIncidents)
      localStorage.setItem("incidents", JSON.stringify(initialIncidents))
    }
  }, [])

  const savePatients = (newPatients: Patient[]) => {
    setPatients(newPatients)
    localStorage.setItem("patients", JSON.stringify(newPatients))
  }

  const saveIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents)
    localStorage.setItem("incidents", JSON.stringify(newIncidents))
  }

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient = { ...patient, id: `p${Date.now()}` }
    const newPatients = [...patients, newPatient]
    savePatients(newPatients)
  }

  const updatePatient = (id: string, patientUpdate: Partial<Patient>) => {
    const newPatients = patients.map((p) => (p.id === id ? { ...p, ...patientUpdate } : p))
    savePatients(newPatients)
  }

  const deletePatient = (id: string) => {
    const newPatients = patients.filter((p) => p.id !== id)
    const newIncidents = incidents.filter((i) => i.patientId !== id)
    savePatients(newPatients)
    saveIncidents(newIncidents)
  }

  const addIncident = (incident: Omit<Incident, "id">) => {
    const newIncident = { ...incident, id: `i${Date.now()}` }
    const newIncidents = [...incidents, newIncident]
    saveIncidents(newIncidents)
  }

  const updateIncident = (id: string, incidentUpdate: Partial<Incident>) => {
    const newIncidents = incidents.map((i) => (i.id === id ? { ...i, ...incidentUpdate } : i))
    saveIncidents(newIncidents)
  }

  const deleteIncident = (id: string) => {
    const newIncidents = incidents.filter((i) => i.id !== id)
    saveIncidents(newIncidents)
  }

  const getPatientIncidents = (patientId: string) => {
    return incidents.filter((i) => i.patientId === patientId)
  }

  const uploadFile = async (file: File): Promise<FileAttachment> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          name: file.name,
          url: reader.result as string,
          type: file.type,
        })
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <DataContext.Provider
      value={{
        patients,
        incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        getPatientIncidents,
        uploadFile,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
