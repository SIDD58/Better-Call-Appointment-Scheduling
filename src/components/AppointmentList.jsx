import React from 'react';
import AppointmentItem from './AppointmentItem';

function AppointmentList({ appointments, onDelete, onEdit, formatDateTime }) {
  return (
    <section className="list-section">
      <div className="card appointments-card">
        <div className="list-header">
          <h2>Upcoming Appointments</h2>
          <span className="badge">{appointments.length} Slots</span>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍃</div>
            <h3>No appointments scheduled</h3>
            <p>Use the form on the left to schedule your first appointment.</p>
          </div>
        ) : (
          <div className="appointment-list">
            {appointments.map((app) => (
              <AppointmentItem
                key={app.id}
                app={app}
                onDelete={onDelete}
                onEdit={onEdit}
                formatDateTime={formatDateTime}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AppointmentList;
