// Mock data for the Medisphere medical system
// Note: Users are now managed through signup. Only admin is pre-seeded for initial setup.
export const initialData = {
  users: [
    {
      id: 'admin-1',
      email: 'admin@medisphere.com',
      password: 'admin123',
      name: 'System Admin',
      role: 'admin',
      createdAt: '2024-01-01'
    },
    {
      id: 'doctor-1',
      email: 'doctor@medisphere.com',
      password: 'doctor123',
      name: 'Dr. Sarah Johnson',
      role: 'doctor',
      specialty: 'General Medicine',
      licenseNumber: 'MD-12345',
      createdAt: '2024-01-15'
    },
    {
      id: 'patient-1',
      email: 'patient@medisphere.com',
      password: 'patient123',
      name: 'John Smith',
      role: 'patient',
      dateOfBirth: '1990-05-20',
      phone: '555-0101',
      address: '123 Main St, City, State 12345',
      createdAt: '2024-02-01'
    },
    {
      id: 'pharmacist-1',
      email: 'pharmacist@medisphere.com',
      password: 'pharm123',
      name: 'Mike Williams',
      role: 'pharmacist',
      licenseNumber: 'RPH-67890',
      pharmacyName: 'MediCare Pharmacy',
      createdAt: '2024-01-20'
    }
  ],
  appointments: [
    {
      id: 'apt-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      date: '2026-02-26',
      time: '10:00',
      status: 'scheduled',
      type: 'virtual',
      symptoms: 'Common cold symptoms',
      notes: ''
    },
    {
      id: 'apt-2',
      patientId: 'patient-2',
      doctorId: 'doctor-2',
      date: '2026-02-27',
      time: '14:00',
      status: 'scheduled',
      type: 'virtual',
      symptoms: 'Heart palpitations',
      notes: ''
    }
  ],
  prescriptions: [
    {
      id: 'rx-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      appointmentId: 'apt-1',
      date: '2026-02-20',
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3 times daily',
          duration: '7 days',
          instructions: 'Take with food'
        }
      ],
      diagnosis: 'Upper Respiratory Infection',
      status: 'active',
      pharmacistId: null
    }
  ],
  medicalRecords: [
    {
      id: 'mr-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      date: '2026-02-20',
      type: 'consultation',
      diagnosis: 'Upper Respiratory Infection',
      treatment: 'Prescribed Amoxicillin',
      notes: 'Rest recommended, follow up in 1 week if symptoms persist'
    },
    {
      id: 'mr-2',
      patientId: 'patient-1',
      date: '2026-01-15',
      type: 'lab_report',
      testName: 'Complete Blood Count (CBC)',
      results: {
        'WBC': '7.5 x10^9/L',
        'RBC': '4.8 x10^12/L',
        'Hemoglobin': '14.2 g/dL',
        'Platelets': '250 x10^9/L'
      },
      status: 'normal',
      labName: 'MediTest Labs'
    }
  ],
  consultations: [
    {
      id: 'cons-1',
      appointmentId: 'apt-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      startTime: '2026-02-26T10:00:00',
      endTime: null,
      status: 'scheduled',
      notes: '',
      prescriptions: []
    }
  ],
  prescriptionOrders: [
    {
      id: 'order-1',
      prescriptionId: 'rx-1',
      patientId: 'patient-1',
      pharmacistId: 'pharmacist-1',
      status: 'pending',
      orderedAt: '2026-02-20T15:00:00',
      processedAt: null,
      notes: ''
    }
  ]
};
