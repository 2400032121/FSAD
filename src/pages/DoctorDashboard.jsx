import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';
import { v4 as uuidv4 } from 'uuid';
import { 
  Activity, Calendar, FileText, Users, Video, 
  LogOut, Search, Plus, Check, X, Stethoscope,
  Pill, Clock, MessageSquare
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, logout, users } = useAuth();
  const { 
    appointments, prescriptions, medicalRecords, consultations,
    addConsultation, updateConsultation, addPrescription, addMedicalRecord,
    updateAppointment
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showConsultation, setShowConsultation] = useState(null);
  const [showPrescription, setShowPrescription] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const doctorAppointments = appointments.filter(apt => apt.doctorId === user.id);
  const upcomingAppointments = doctorAppointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = doctorAppointments.filter(apt => apt.status === 'completed');

  const getPatientInfo = (patientId) => {
    return users.find(u => u.id === patientId);
  };

  const startConsultation = (appointment) => {
    const consultation = {
      id: `cons-${uuidv4()}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: user.id,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'in-progress',
      notes: '',
      prescriptions: []
    };
    addConsultation(consultation);
    setShowConsultation(appointment);
    updateAppointment(appointment.id, { status: 'in-progress' });
  };

  const endConsultation = (consultationId, notes) => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (consultation) {
      updateConsultation(consultationId, {
        endTime: new Date().toISOString(),
        status: 'completed',
        notes
      });
    }
    updateAppointment(showConsultation?.id, { status: 'completed' });
    setShowConsultation(null);
  };

  const handleAddMedication = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemoveMedication = (index) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleSubmitPrescription = (appointmentId) => {
    const prescription = {
      id: `rx-${uuidv4()}`,
      patientId: showConsultation.patientId,
      doctorId: user.id,
      appointmentId,
      date: new Date().toISOString().split('T')[0],
      medications: prescriptionForm.medications,
      diagnosis: prescriptionForm.diagnosis,
      status: 'active',
      pharmacistId: null
    };
    addPrescription(prescription);

    const medicalRecord = {
      id: `mr-${uuidv4()}`,
      patientId: showConsultation.patientId,
      doctorId: user.id,
      date: new Date().toISOString().split('T')[0],
      type: 'consultation',
      diagnosis: prescriptionForm.diagnosis,
      treatment: prescriptionForm.medications.map(m => m.name).join(', '),
      notes: `Prescribed ${prescriptionForm.medications.length} medication(s)`
    };
    addMedicalRecord(medicalRecord);

    setPrescriptionForm({
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
    setShowPrescription(null);
  };

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Activity size={28} />
          <span>Arogyaa</span>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.specialty}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'appointments' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Appointments</h1>
              <div className="header-stats">
                <span className="stat-pill">
                  <Clock size={16} />
                  {upcomingAppointments.length} Upcoming
                </span>
              </div>
            </header>

            <div className="appointments-list">
              <h2>Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                upcomingAppointments.map(apt => {
                  const patient = getPatientInfo(apt.patientId);
                  return (
                    <div key={apt.id} className="appointment-card">
                      <div className="appointment-info">
                        <div className="appointment-header">
                          <h3>{patient?.name}</h3>
                          <span className={`status-badge ${apt.status}`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="appointment-meta">
                          <span><Calendar size={14} /> {apt.date} at {apt.time}</span>
                          <span><Video size={14} /> {apt.type}</span>
                        </div>
                        <div className="appointment-symptoms">
                          <strong>Symptoms:</strong> {apt.symptoms}
                        </div>
                      </div>
                      <div className="appointment-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={() => startConsultation(apt)}
                        >
                          <Video size={18} />
                          Start Consultation
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="appointments-list">
              <h2>Completed Appointments</h2>
              {completedAppointments.length === 0 ? (
                <div className="empty-state">
                  <Check size={48} />
                  <p>No completed appointments yet</p>
                </div>
              ) : (
                completedAppointments.map(apt => {
                  const patient = getPatientInfo(apt.patientId);
                  return (
                    <div key={apt.id} className="appointment-card completed">
                      <div className="appointment-info">
                        <div className="appointment-header">
                          <h3>{patient?.name}</h3>
                          <span className={`status-badge ${apt.status}`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="appointment-meta">
                          <span><Calendar size={14} /> {apt.date} at {apt.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>My Patients</h1>
            </header>

            <div className="patients-grid">
              {[...new Set(doctorAppointments.map(apt => apt.patientId))].map(patientId => {
                const patient = getPatientInfo(patientId);
                const patientAppointments = doctorAppointments.filter(apt => apt.patientId === patientId);
                const patientRecords = medicalRecords.filter(mr => mr.patientId === patientId);
                
                return (
                  <div key={patientId} className="patient-card">
                    <div className="patient-avatar">
                      {patient?.name.charAt(0)}
                    </div>
                    <div className="patient-info">
                      <h3>{patient?.name}</h3>
                      <p>DOB: {patient?.dateOfBirth}</p>
                      <p>Blood Type: {patient?.bloodType}</p>
                      {patient?.allergies.length > 0 && (
                        <p className="allergies">Allergies: {patient?.allergies.join(', ')}</p>
                      )}
                      <div className="patient-stats">
                        <span>{patientAppointments.length} visits</span>
                        <span>{patientRecords.length} records</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Medical Records</h1>
            </header>

            <div className="records-list">
              {medicalRecords.filter(mr => mr.doctorId === user.id).length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} />
                  <p>No medical records yet</p>
                </div>
              ) : (
                medicalRecords.filter(mr => mr.doctorId === user.id).map(record => {
                  const patient = getPatientInfo(record.patientId);
                  return (
                    <div key={record.id} className="record-card">
                      <div className="record-header">
                        <h3>{record.type === 'consultation' ? 'Consultation' : 'Lab Report'}</h3>
                        <span className="record-date">{record.date}</span>
                      </div>
                      <div className="record-details">
                        <p><strong>Patient:</strong> {patient?.name}</p>
                        <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                        <p><strong>Treatment:</strong> {record.treatment}</p>
                        {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Prescriptions</h1>
            </header>

            <div className="prescriptions-list">
              {prescriptions.filter(rx => rx.doctorId === user.id).length === 0 ? (
                <div className="empty-state">
                  <Pill size={48} />
                  <p>No prescriptions issued yet</p>
                </div>
              ) : (
                prescriptions.filter(rx => rx.doctorId === user.id).map(rx => {
                  const patient = getPatientInfo(rx.patientId);
                  return (
                    <div key={rx.id} className="prescription-card">
                      <div className="prescription-header">
                        <h3>Prescription #{rx.id.slice(-4)}</h3>
                        <span className={`status-badge ${rx.status}`}>{rx.status}</span>
                      </div>
                      <div className="prescription-details">
                        <p><strong>Patient:</strong> {patient?.name}</p>
                        <p><strong>Date:</strong> {rx.date}</p>
                        <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                        <div className="medications-list">
                          <strong>Medications:</strong>
                          {rx.medications.map((med, idx) => (
                            <div key={idx} className="medication-item">
                              <span>{med.name} - {med.dosage}</span>
                              <span>{med.frequency} for {med.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* Consultation Modal */}
      {showConsultation && (
        <div className="modal-overlay">
          <div className="modal consultation-modal">
            <div className="modal-header">
              <h2>Virtual Consultation</h2>
              <button className="close-btn" onClick={() => setShowConsultation(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="consultation-content">
              <div className="video-container">
                <div className="video-placeholder">
                  <Video size={64} />
                  <p>Video Consultation in Progress</p>
                </div>
              </div>

              <div className="consultation-chat">
                <div className="chat-messages">
                  <MessageSquare size={20} />
                  <p>Chat with patient...</p>
                </div>
              </div>

              <div className="consultation-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowPrescription(showConsultation.id)}
                >
                  <Pill size={18} />
                  Create Prescription
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    const cons = consultations.find(c => c.appointmentId === showConsultation.id);
                    if (cons) endConsultation(cons.id, 'Consultation completed');
                  }}
                >
                  <Check size={18} />
                  End Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescription && (
        <div className="modal-overlay">
          <div className="modal prescription-modal">
            <div className="modal-header">
              <h2>Create E-Prescription</h2>
              <button className="close-btn" onClick={() => setShowPrescription(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="prescription-form">
              <div className="form-group">
                <label>Diagnosis</label>
                <input
                  type="text"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Enter diagnosis"
                />
              </div>

              <div className="medications-section">
                <div className="section-header">
                  <h3>Medications</h3>
                  <button className="btn btn-secondary" onClick={handleAddMedication}>
                    <Plus size={18} />
                    Add Medication
                  </button>
                </div>

                {prescriptionForm.medications.map((med, idx) => (
                  <div key={idx} className="medication-form">
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Medication name"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(idx, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(idx, 'dosage', e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Frequency (e.g., 3 times daily)"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(idx, 'frequency', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 7 days)"
                        value={med.duration}
                        onChange={(e) => handleMedicationChange(idx, 'duration', e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Special instructions"
                      value={med.instructions}
                      onChange={(e) => handleMedicationChange(idx, 'instructions', e.target.value)}
                    />
                    {prescriptionForm.medications.length > 1 && (
                      <button 
                        className="btn-icon delete"
                        onClick={() => handleRemoveMedication(idx)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleSubmitPrescription(showPrescription)}
                >
                  <Check size={18} />
                  Submit Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
