import React from 'react';

function AppointmentItem({ app, onDelete, onEdit, formatDateTime }) {
  return (
    <div className="appointment-item card glass-card animate-fade-in">
      <div className="appointment-details">
        <h3 className="customer-title">{app.customerName}</h3>
        <div className="detail-row">
          <span className="detail-icon">📞</span>
          <span className="detail-value">{app.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">⏰</span>
          <span className="detail-value date-value">{formatDateTime(app.time)}</span>
        </div>
      </div>
      <div className="item-actions" style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onEdit(app)}
          className="delete-btn edit-btn"
          aria-label={`Edit appointment for ${app.customerName}`}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(app.id)}
          className="delete-btn"
          aria-label={`Cancel appointment for ${app.customerName}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default AppointmentItem;
