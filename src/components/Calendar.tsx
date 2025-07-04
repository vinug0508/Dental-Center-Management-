"use client"

import type React from "react"
import { useState } from "react"
import { useData } from "../contexts/DataContext"

const Calendar: React.FC = () => {
  const { incidents, patients } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return incidents.filter((incident) => {
      const appointmentDate = new Date(incident.appointmentDate)
      return appointmentDate.toDateString() === dateStr
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <button onClick={() => navigateMonth("prev")} className="nav-button">
            ‹
          </button>
          <h2>{monthName}</h2>
          <button onClick={() => navigateMonth("next")} className="nav-button">
            ›
          </button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="calendar-day empty"></div>
              }

              const appointments = getAppointmentsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()

              return (
                <div key={index} className={`calendar-day ${isToday ? "today" : ""}`}>
                  <div className="day-number">{day.getDate()}</div>
                  <div className="day-appointments">
                    {appointments.slice(0, 3).map((appointment) => {
                      const patient = patients.find((p) => p.id === appointment.patientId)
                      return (
                        <div
                          key={appointment.id}
                          className={`appointment-item ${appointment.status.toLowerCase()}`}
                          title={`${appointment.title} - ${patient?.name}`}
                        >
                          <span className="appointment-time">
                            {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="appointment-title">{appointment.title}</span>
                        </div>
                      )
                    })}
                    {appointments.length > 3 && (
                      <div className="more-appointments">+{appointments.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const days = getWeekDays(currentDate)
    const weekRange = `${days[0].toLocaleDateString()} - ${days[6].toLocaleDateString()}`

    return (
      <div className="calendar-week">
        <div className="calendar-header">
          <button onClick={() => navigateWeek("prev")} className="nav-button">
            ‹
          </button>
          <h2>{weekRange}</h2>
          <button onClick={() => navigateWeek("next")} className="nav-button">
            ›
          </button>
        </div>

        <div className="week-grid">
          {days.map((day, index) => {
            const appointments = getAppointmentsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div key={index} className={`week-day ${isToday ? "today" : ""}`}>
                <div className="week-day-header">
                  <div className="day-name">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="day-number">{day.getDate()}</div>
                </div>

                <div className="week-day-appointments">
                  {appointments.map((appointment) => {
                    const patient = patients.find((p) => p.id === appointment.patientId)
                    return (
                      <div key={appointment.id} className={`week-appointment ${appointment.status.toLowerCase()}`}>
                        <div className="appointment-time">
                          {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="appointment-details">
                          <div className="appointment-title">{appointment.title}</div>
                          <div className="appointment-patient">{patient?.name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="calendar">
      <div className="calendar-controls">
        <h1>Calendar</h1>
        <div className="view-controls">
          <button className={`view-button ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>
            Month
          </button>
          <button className={`view-button ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>
            Week
          </button>
        </div>
      </div>

      {view === "month" ? renderMonthView() : renderWeekView()}
    </div>
  )
}

export default Calendar
