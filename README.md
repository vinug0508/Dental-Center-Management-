# 🦷 Dental Center Management Dashboard

A React + TypeScript-based dental clinic management system built as part of the **ENTNT Technical Assignment**. This application supports both **Admin** and **Patient** roles, and stores all data using browser `localStorage`.

---

## 📌 Features

### 🔐 User Authentication
- Role-based access: `Admin` and `Patient`
- Session persistence via `localStorage`
- Includes demo users for testing

### 🧑‍⚕️ Admin Dashboard
- **Patient Management**: Add, edit, delete patient records
- **Appointment Management**: Schedule, update, cancel appointments
- **Calendar View**: Switch between month and week views
- **Dashboard Overview**: KPIs, revenue, upcoming appointments
- **File Upload**: Upload treatment files, invoices, and images (Base64 format)

### 👨‍💼 Patient Portal
- View appointment history
- Access treatment records including costs and files
- See upcoming scheduled appointments

---

## 📁 Project Structure

src/
├── components/
│ ├── Login.tsx
│ ├── Layout.tsx
│ ├── ProtectedRoute.tsx
│ ├── Dashboard.tsx
│ ├── PatientManagement.tsx
│ ├── AppointmentManagement.tsx
│ ├── Calendar.tsx
│ └── PatientView.tsx
├── contexts/
│ ├── AuthContext.tsx
│ └── DataContext.tsx
├── App.tsx
├── App.css
└── index.tsx

## Patient
interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
  email?: string;
}

## Incident  (Appointment/Treatment)
interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  nextDate?: string;
  files: FileAttachment[];
}
