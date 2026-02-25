import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';
import { 
  Activity, Users, Shield, Settings, LogOut, 
  Trash2, Search, FileText, Calendar,
  UserCheck, UserX
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, users, deleteUser } = useAuth();
  const { appointments, prescriptions, medicalRecords } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = {
    totalUsers: users.length,
    totalDoctors: users.filter(u => u.role === 'doctor').length,
    totalPatients: users.filter(u => u.role === 'patient').length,
    totalPharmacists: users.filter(u => u.role === 'pharmacist').length,
    totalAppointments: appointments.length,
    totalPrescriptions: prescriptions.length,
    totalRecords: medicalRecords.length,
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
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
              <span className="user-role">Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user.name}</p>
            </header>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalUsers}</span>
                  <span className="stat-label">Total Users</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon doctors">
                  <UserCheck size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalDoctors}</span>
                  <span className="stat-label">Doctors</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon patients">
                  <UserX size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalPatients}</span>
                  <span className="stat-label">Patients</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon pharmacists">
                  <Shield size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalPharmacists}</span>
                  <span className="stat-label">Pharmacists</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon appointments">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalAppointments}</span>
                  <span className="stat-label">Appointments</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon prescriptions">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalPrescriptions}</span>
                  <span className="stat-label">Prescriptions</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {appointments.slice(-5).reverse().map(apt => {
                  const patient = users.find(u => u.id === apt.patientId);
                  const doctor = users.find(u => u.id === apt.doctorId);
                  return (
                    <div key={apt.id} className="activity-item">
                      <div className="activity-icon">
                        <Calendar size={18} />
                      </div>
                      <div className="activity-details">
                        <span>New appointment scheduled</span>
                        <span className="activity-meta">
                          {patient?.name} with {doctor?.name} on {apt.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>User Management</h1>
            </header>

            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Specialty</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.specialty || '-'}</td>
                      <td>{u.createdAt}</td>
                      <td>
                        <button
                          className="btn-icon delete"
                          onClick={() => deleteUser(u.id)}
                          disabled={u.id === user.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Platform Settings</h1>
            </header>

            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="settings-card">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Require 2FA for all admin accounts</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Data Encryption</h3>
                    <p>Enable end-to-end encryption for medical records</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Session Timeout</h3>
                    <p>Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>Platform Settings</h2>
              <div className="settings-card">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Virtual Consultations</h3>
                    <p>Enable video consultation feature</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>E-Prescriptions</h3>
                    <p>Allow doctors to issue digital prescriptions</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Lab Reports</h3>
                    <p>Enable lab report upload and viewing</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
