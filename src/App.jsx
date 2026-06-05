import { useState, useEffect } from 'react';
import './App.css';
import supabase from './config/SupaBaseClient';
import Header from './components/Header';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import Footer from './components/Footer';

// function App() {
//   console.log(supabase)
//   const [supa_error, set_fetch_error] = useState(null)
//   const [appointments, set_appointments] = useState(null)

//   useEffect(
//     () => {
//       const view_database = async () => {
//         const { data, error } = await supabase.from('Appointment').select()
//         if (error) {
//           set_fetch_error("Cannot Fetch Records")
//           console.log("Error", error)
//           set_appointments(null)
//         }
//         else if (data) {
//           set_appointments(data)
//           console.log("Data has been added", data)
//           set_fetch_error(null)
//         }
//       };
//       view_database()
//     }, []
//   )

//   return (
//     <>
//       {supa_error && <p>{supa_error}</p>}

//       {appointments &&
//         <ul>
//           {appointments.map(
//             (appointment) => {
//               return (
//                 <li key={appointment.id}>
//                   {appointment.customerName}
//                   {appointment.phone}
//                   {appointment.time}
//                 </li>
//               )
//             }
//           )}
//         </ul>
//       }



//     </>
//   )
// }




function App() {
  console.log(supabase);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Database initialization
  useEffect(() => {
    const initialize_database = async () => {
      const { data, error } = await supabase.from('Appointment').select();
      if (error) {
        console.error("Database initialization Error", error);
      } else if (data) {
        setAppointments(data);
      }
    };
    initialize_database();
  }, []);

  const handleAddAppointment = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('Appointment')
        .insert([
          {
            customerName: formData.customerName,
            phone: formData.phone,
            time: formData.time
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Record could not be inserted", error);
        return false;
      }

      if (data) {
        setAppointments([data, ...appointments]);
        return true;
      }
    } catch (err) {
      console.error("Unexpected error inserting record:", err);
      return false;
    }
  };

  const handleUpdateAppointment = async (id, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('Appointment')
        .update({
          customerName: updatedData.customerName,
          phone: updatedData.phone,
          time: updatedData.time
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Record could not be updated", error);
        return false;
      }

      if (data) {
        setAppointments(appointments.map(app => app.id === id ? data : app));
        setEditingAppointment(null);
        return true;
      }
    } catch (err) {
      console.error("Unexpected error updating record:", err);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('Appointment')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Record could not be deleted", error);
        return;
      }

      setAppointments(appointments.filter(app => app.id !== id));
      if (editingAppointment?.id === id) {
        setEditingAppointment(null);
      }
    } catch (err) {
      console.error("Unexpected error deleting record:", err);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <AppointmentForm
          onAddAppointment={handleAddAppointment}
          editingAppointment={editingAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          onCancelEdit={() => setEditingAppointment(null)}
        />
        <AppointmentList
          appointments={appointments}
          onDelete={handleDelete}
          onEdit={setEditingAppointment}
          formatDateTime={formatDateTime}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
