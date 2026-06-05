import React, { useState, useEffect } from 'react';

function AppointmentForm({ onAddAppointment, editingAppointment, onUpdateAppointment, onCancelEdit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    time: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pre-fill form fields when editingAppointment is selected
  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        customerName: editingAppointment.customerName,
        phone: editingAppointment.phone,
        time: editingAppointment.time || ''
      });
      setErrors({});
    } else {
      setFormData({ customerName: '', phone: '', time: '' });
    }
  }, [editingAppointment]);

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 3) {
      newErrors.customerName = 'Name must be at least 3 characters';
    }

    // Basic phone validation (allowing digits, spaces, dashes, parentheses)
    const phoneRegex = /^[\d\s()+-]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.time) {
      newErrors.time = 'Appointment time is required';
    } else {
      const selectedTime = new Date(formData.time);
      if (selectedTime < new Date()) {
        newErrors.time = 'Appointment must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let success;
      if (editingAppointment) {
        success = await onUpdateAppointment(editingAppointment.id, formData);
      } else {
        success = await onAddAppointment(formData);
      }
      
      if (success) {
        setFormData({ customerName: '', phone: '', time: '' });
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 4000);
      }
    }
  };

  return (
    <section className="form-section">
      <div className="card glass-card">
        <h2>{editingAppointment ? 'Edit Appointment' : 'Schedule Appointment'}</h2>
        <p className="card-desc">
          {editingAppointment 
            ? 'Modify the details below to update this appointment slot.' 
            : 'Enter details below to reserve an appointment slot.'}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="customerName">Customer Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={errors.customerName ? 'input-error' : ''}
                required
              />
            </div>
            {errors.customerName && <span className="error-text">{errors.customerName}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <span className="input-icon">📞</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                className={errors.phone ? 'input-error' : ''}
                required
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="time">Appointment Time</label>
            <div className="input-wrapper">
              <span className="input-icon">⏰</span>
              <input
                type="datetime-local"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={errors.time ? 'input-error' : ''}
                required
              />
            </div>
            {errors.time && <span className="error-text">{errors.time}</span>}
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="submit-btn" style={{ flex: 1 }}>
              {editingAppointment ? 'Update Booking' : 'Confirm Booking'}
            </button>
            {editingAppointment && (
              <button 
                type="button" 
                onClick={onCancelEdit} 
                className="submit-btn cancel-btn"
                style={{ flex: 1, backgroundColor: 'var(--bg-card, #2c2c35)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {isSubmitted && (
          <div className="success-toast animate-slide-in">
            <span className="toast-icon">✨</span>
            <div>
              <h4>{editingAppointment ? 'Booking Updated!' : 'Booking Confirmed!'}</h4>
              <p>The appointment has been successfully recorded.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AppointmentForm;
