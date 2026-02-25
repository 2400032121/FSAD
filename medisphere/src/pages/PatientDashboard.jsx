import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';
import { v4 as uuidv4 } from 'uuid';
import { 
  Activity, Calendar, FileText, Video, LogOut, 
  Plus, Search, Pill, Clock, User, Heart,
  AlertCircle, CheckCircle
} from 'lucide-react';

export default function PatientDashboard() {
  const { user, logout, users } = useAuth();
  const { appointments, prescriptions, medicalRecords, addAppointment, consultations } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    symptoms: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const patientAppointments = appointments.filter(apt => apt.patientId === user.id);
  const upcomingAppointments = patientAppointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = patientAppointments.filter(apt => apt.status === 'completed');

  const patientPrescriptions = prescriptions.filter(rx => rx.patientId === user.id);
  const activePrescriptions = patientPrescriptions.filter(rx => rx.status === 'active');

  const patientRecords = medicalRecords.filter(mr => mr.patientId === user.id);

  const doctors = users.filter(u => u.role === 'doctor');

  const getDoctorInfo = (doctorId) => {
    return users.find(u => u.id === doctorId);
  };

  const handleBookAppointment = () => {
    const newAppointment = {
      id: `apt-${uuidv4()}`,
      patientId: user.id,
      doctorId: bookingForm.doctorId,
      date: bookingForm.date,
      time: bookingForm.time,
      status: 'scheduled',
      type: 'virtual',
      symptoms: bookingForm.symptoms,
      notes: ''
    };
    addAppointment(newAppointment);
    setShowBookAppointment(false);
    setBookingForm({ doctorId: '', date: '', time: '', symptoms: '' });
  };

  const getConsultationStatus = (appointmentId) => {
    const consultation = consultations.find(c => c.appointmentId === appointmentId);
    return consultation?.status || null;
  };

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: User },
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
              <span className="user-role">Patient</span>
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
              <h1>My Appointments</h1>
              <button 
                className="btn btn-primary"
                onClick={() => setShowBookAppointment(true)}
              >
                <Plus size={18} />
                Book Appointment
              </button>
            </header>

            <div className="appointments-list">
              <h2>Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <p>No upcoming appointments</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowBookAppointment(true)}
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                upcomingAppointments.map(apt => {
                  const doctor = getDoctorInfo(apt.doctorId);
                  const consultationStatus = getConsultationStatus(apt.id);
                  return (
                    <div key={apt.id} className="appointment-card">
                      <div className="appointment-info">
                        <div className="appointment-header">
                          <h3>Dr. {doctor?.name}</h3>
                          <span className={`status-badge ${apt.status}`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="appointment-meta">
                          <span><Calendar size={14} /> {apt.date} at {apt.time}</span>
                          <span><Video size={14} /> {apt.type}</span>
                        </div>
                        <div className="appointment-specialty">
                          {doctor?.specialty}
                        </div>
                        {consultationStatus === 'in-progress' && (
                          <div className="consultation-ready">
                            <AlertCircle size={16} />
                            <span>Your consultation is ready!</span>
                            <button className="btn btn-success">
                              <Video size={16} />
                              Join Now
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="appointments-list">
              <h2>Past Appointments</h2>
              {completedAppointments.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={48} />
                  <p>No past appointments</p>
                </div>
              ) : (
                completedAppointments.map(apt => {
                  const doctor = getDoctorInfo(apt.doctorId);
                  return (
                    <div key={apt.id} className="appointment-card completed">
                      <div className="appointment-info">
                        <div className="appointment-header">
                          <h3>Dr. {doctor?.name}</h3>
                          <span className={`status-badge ${apt.status}`}>
                                                     </span>
                        </div>
 {apt.status}
                        <div className="appointment-meta">
                          <span><Calendar size={14} /> {apt.date} at {apt.time}</span>
                        </div>
                        <div className="appointment-specialty">
                          {doctor?.specialty}
                        </div>
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
              <h1>My Prescriptions</h1>
            </header>

            <div className="prescriptions-list">
              {patientPrescriptions.length === 0 ? (
                <div className="empty-state">
                  <Pill size={48} />
                  <p>No prescriptions yet</p>
                </div>
              ) : (
                patientPrescriptions.map(rx => {
                  const doctor = getDoctorInfo(rx.doctorId);
                  return (
                    <div key={rx.id} className="prescription-card">
                      <div className="prescription-header">
                        <h3>Prescription #{rx.id.slice(-4)}</h3>
                        <span className={`status-badge ${rx.status}`}>{rx.status}</span>
                      </div>
                      <div className="prescription-details">
                        <p><strong>Doctor:</strong> Dr. {doctor?.name}</p>
                        <p><strong>Date:</strong> {rx.date}</p>
                        <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                        <div className="medications-list">
                          <strong>Medications:</strong>
                          {rx.medications.map((med, idx) => (
                            <div key={idx} className="medication-item">
                              <span className="med-name">{med.name}</span>
                              <span className="med-dosage">{med.dosage}</span>
                              <span className="med-freq">{med.frequency}</span>
                              <span className="med-duration">for {med.duration}</span>
                              {med.instructions && (
                                <span className="med-instructions">{med.instructions}</span>
                              )}
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

        {activeTab === 'records' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Medical Records & Lab Reports</h1>
            </header>

            <div className="records-list">
              {patientRecords.length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} />
                  <p>No medical records yet</p>
                </div>
              ) : (
                patientRecords.map(record => {
                  const doctor = record.doctorId ? getDoctorInfo(record.doctorId) : null;
                  return (
                    <div key={record.id} className="record-card">
                      <div className="record-header">
                        <h3>
                          {record.type === 'consultation' ? 'Consultation Report' : 'Lab Report'}
                        </h3>
                        <span className="record-date">{record.date}</span>
                      </div>
                      {record.type === 'lab_report' && (
                        <div className="lab-report">
                          <p><strong>Test:</strong> {record.testName}</p>
                          <p><strong>Lab:</strong> {record.labName}</p>
                          <div className="lab-results">
                            <h4>Results:</h4>
                            <div className="results-grid">
                              {Object.entries(record.results).map(([key, value]) => (
                                <div key={key} className="result-item">
                                  <span className="result-key">{key}</span>
                                  <span className={`result-value ${record.status}`}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={`status-indicator ${record.status}`}>
                            <CheckCircle size={16} />
                            {record.status === 'normal' ? 'Normal' : 'Abnormal'}
                          </div>
                        </div>
                      )}
                      {record.type === 'consultation' && (
                        <div className="record-details">
                          <p><strong>Doctor:</strong> Dr. {doctor?.name}</p>
                          <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                          <p><strong>Treatment:</strong> {record.treatment}</p>
                          {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>My Profile</h1>
            </header>

            <div className="profile-section">
              <div className="profile-card">
                <div className="profile-avatar-large">
                  {user.name.charAt(0)}
                </div>
                <div className="profile-info">
                  <h2>{user.name}</h2>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-group">
                  <label>Date of Birth</label>
                  <span>{user.dateOfBirth}</span>
                </div>
                <div className="detail-group">
                  <label>Blood Type</label>
                  <span className="blood-type">{user.bloodType}</span>
                </div>
                <div className="detail-group">
                  <label>Allergies</label>
                  <span className="allergies-list">
                    {user.allergies.length > 0 ? user.allergies.join(', ') : 'None'}
                  </span>
                </div>
              </div>

              <div className="health-summary">
                <h3>Health Summary</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <Calendar size={20} />
                    <div>
                      <span className="stat-value">{patientAppointments.length}</span>
                      <span className="stat-label">Total Visits</span>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <Pill size={20} />
                    <div>
                      <span className="stat-value">{activePrescriptions.length}</span>
                      <span className="stat-label">Active Prescriptions</span>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <FileText size={20} />
                    <div>
                      <span className="stat-value">{patientRecords.length}</span>
                      <span className="stat-label">Medical Records</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookAppointment && (
        <div className="modal-overlay">
          <div className="modal booking-modal">
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button 
                className="close-btn"
                onClick={() => setShowBookAppointment(false)}
              >
                &times;
              </button>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  value={bookingForm.doctorId}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, doctorId: e.target.value }))}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.name} - {doc.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Symptoms / Reason for Visit</label>
                <textarea
                  value={bookingForm.symptoms}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="Describe your symptoms..."
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowBookAppointment(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleBookAppointment}
                  disabled={!bookingForm.doctorId || !bookingForm.date || !bookingForm.time || !bookingForm.symptoms}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
