import { createContext, useState, useEffect } from 'react';
import { initialData } from '../data/mockData';

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext(null);

// Helper function to load data from localStorage with fallback to initialData
const loadFromStorage = () => {
  try {
    const storedAppointments = localStorage.getItem('medisphere_appointments');
    const storedPrescriptions = localStorage.getItem('medisphere_prescriptions');
    const storedRecords = localStorage.getItem('medisphere_records');
    const storedConsultations = localStorage.getItem('medisphere_consultations');
    const storedOrders = localStorage.getItem('medisphere_orders');

    // Only use stored data if ALL items exist
    if (storedAppointments && storedPrescriptions && storedRecords && storedConsultations && storedOrders) {
      return {
        appointments: JSON.parse(storedAppointments),
        prescriptions: JSON.parse(storedPrescriptions),
        medicalRecords: JSON.parse(storedRecords),
        consultations: JSON.parse(storedConsultations),
        prescriptionOrders: JSON.parse(storedOrders)
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  // Return initial data as fallback
  return {
    appointments: initialData.appointments,
    prescriptions: initialData.prescriptions,
    medicalRecords: initialData.medicalRecords,
    consultations: initialData.consultations,
    prescriptionOrders: initialData.prescriptionOrders
  };
};

export function DataProvider({ children }) {
  // Use lazy initialization to load from localStorage once during initial render
  // This avoids calling setState synchronously within useEffect
  const [appointments, setAppointments] = useState(() => loadFromStorage().appointments);
  const [prescriptions, setPrescriptions] = useState(() => loadFromStorage().prescriptions);
  const [medicalRecords, setMedicalRecords] = useState(() => loadFromStorage().medicalRecords);
  const [consultations, setConsultations] = useState(() => loadFromStorage().consultations);
  const [prescriptionOrders, setPrescriptionOrders] = useState(() => loadFromStorage().prescriptionOrders);

  // Save to localStorage whenever data changes
  // This is correct - we're syncing React state to external system (localStorage)
  useEffect(() => {
    localStorage.setItem('medisphere_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medisphere_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('medisphere_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('medisphere_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem('medisphere_orders', JSON.stringify(prescriptionOrders));
  }, [prescriptionOrders]);

  // Appointments
  const addAppointment = (appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id, updates) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  // Prescriptions
  const addPrescription = (prescription) => {
    setPrescriptions(prev => [...prev, prescription]);
  };

  const updatePrescription = (id, updates) => {
    setPrescriptions(prev => prev.map(rx => 
      rx.id === id ? { ...rx, ...updates } : rx
    ));
  };

  // Medical Records
  const addMedicalRecord = (record) => {
    setMedicalRecords(prev => [...prev, record]);
  };

  // Consultations
  const addConsultation = (consultation) => {
    setConsultations(prev => [...prev, consultation]);
  };

  const updateConsultation = (id, updates) => {
    setConsultations(prev => prev.map(cons => 
      cons.id === id ? { ...cons, ...updates } : cons
    ));
  };

  // Prescription Orders
  const addPrescriptionOrder = (order) => {
    setPrescriptionOrders(prev => [...prev, order]);
  };

  const updatePrescriptionOrder = (id, updates) => {
    setPrescriptionOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  return (
    <DataContext.Provider value={{
      appointments,
      prescriptions,
      medicalRecords,
      consultations,
      prescriptionOrders,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addPrescription,
      updatePrescription,
      addMedicalRecord,
      addConsultation,
      updateConsultation,
      addPrescriptionOrder,
      updatePrescriptionOrder
    }}>
      {children}
    </DataContext.Provider>
  );
}
