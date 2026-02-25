import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';
import { 
  Activity, Pill, Package, LogOut, Search, 
  Check, Clock, FileText, AlertCircle,
  CheckCircle, Truck
} from 'lucide-react';

export default function PharmacistDashboard() {
  const { user, logout, users } = useAuth();
  const { prescriptions, prescriptionOrders, updatePrescriptionOrder } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pharmacistOrders = prescriptionOrders.filter(order => 
    order.pharmacistId === user.id || !order.pharmacistId
  );

  const pendingOrders = pharmacistOrders.filter(order => order.status === 'pending');
  const processedOrders = pharmacistOrders.filter(order => order.status === 'processed' || order.status === 'completed');

  const getPatientInfo = (patientId) => {
    return users.find(u => u.id === patientId);
  };

  const getPrescriptionInfo = (prescriptionId) => {
    return prescriptions.find(rx => rx.id === prescriptionId);
  };

  const getDoctorInfo = (doctorId) => {
    return users.find(u => u.id === doctorId);
  };

  const processOrder = (orderId) => {
    updatePrescriptionOrder(orderId, {
      status: 'processed',
      processedAt: new Date().toISOString()
    });
  };

  const completeOrder = (orderId) => {
    updatePrescriptionOrder(orderId, {
      status: 'completed'
    });
  };

  const assignToMe = (orderId) => {
    updatePrescriptionOrder(orderId, {
      pharmacistId: user.id
    });
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'inventory', label: 'Inventory', icon: FileText },
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
              <span className="user-role">{user.pharmacy}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Prescription Orders</h1>
              <div className="header-stats">
                <span className="stat-pill pending">
                  <Clock size={16} />
                  {pendingOrders.length} Pending
                </span>
              </div>
            </header>

            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="orders-list">
              <h2>Pending Orders</h2>
              {pendingOrders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <p>No pending orders</p>
                </div>
              ) : (
                pendingOrders.map(order => {
                  const prescription = getPrescriptionInfo(order.prescriptionId);
                  const patient = getPatientInfo(order.patientId);
                  const doctor = prescription ? getDoctorInfo(prescription.doctorId) : null;
                  
                  return (
                    <div key={order.id} className="order-card pending">
                      <div className="order-header">
                        <h3>Order #{order.id.slice(-4)}</h3>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="order-details">
                        <div className="order-info">
                          <p><strong>Patient:</strong> {patient?.name}</p>
                          <p><strong>Prescribed by:</strong> Dr. {doctor?.name}</p>
                          <p><strong>Date:</strong> {order.orderedAt?.split('T')[0]}</p>
                        </div>
                        
                        {prescription && (
                          <div className="prescription-preview">
                            <h4>Medications:</h4>
                            {prescription.medications.map((med, idx) => (
                              <div key={idx} className="med-preview">
                                <Pill size={14} />
                                <span>{med.name} - {med.dosage}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="order-actions">
                        {!order.pharmacistId && (
                          <button 
                            className="btn btn-secondary"
                            onClick={() => assignToMe(order.id)}
                          >
                            Accept Order
                          </button>
                        )}
                        {order.pharmacistId === user.id && (
                          <>
                            <button 
                              className="btn btn-primary"
                              onClick={() => processOrder(order.id)}
                            >
                              <Check size={18} />
                              Process
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="orders-list">
              <h2>Processed Orders</h2>
              {processedOrders.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={48} />
                  <p>No processed orders</p>
                </div>
              ) : (
                processedOrders.map(order => {
                  const prescription = getPrescriptionInfo(order.prescriptionId);
                  const patient = getPatientInfo(order.patientId);
                  const doctor = prescription ? getDoctorInfo(prescription.doctorId) : null;
                  
                  return (
                    <div key={order.id} className={`order-card ${order.status}`}>
                      <div className="order-header">
                        <h3>Order #{order.id.slice(-4)}</h3>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="order-details">
                        <div className="order-info">
                          <p><strong>Patient:</strong> {patient?.name}</p>
                          <p><strong>Prescribed by:</strong> Dr. {doctor?.name}</p>
                          <p><strong>Ordered:</strong> {order.orderedAt?.split('T')[0]}</p>
                          {order.processedAt && (
                            <p><strong>Processed:</strong> {order.processedAt.split('T')[0]}</p>
                          )}
                        </div>
                        
                        {prescription && (
                          <div className="prescription-preview">
                            <h4>Medications:</h4>
                            {prescription.medications.map((med, idx) => (
                              <div key={idx} className="med-preview">
                                <Pill size={14} />
                                <span>{med.name} - {med.dosage}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="order-actions">
                        {order.status === 'processed' && order.pharmacistId === user.id && (
                          <button 
                            className="btn btn-success"
                            onClick={() => completeOrder(order.id)}
                          >
                            <Truck size={18} />
                            Mark as Dispatched
                          </button>
                        )}
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
              <h1>Active Prescriptions</h1>
            </header>

            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="prescriptions-list">
              {prescriptions.length === 0 ? (
                <div className="empty-state">
                  <Pill size={48} />
                  <p>No prescriptions in system</p>
                </div>
              ) : (
                prescriptions.map(rx => {
                  const patient = getPatientInfo(rx.patientId);
                  const doctor = getDoctorInfo(rx.doctorId);
                  
                  return (
                    <div key={rx.id} className="prescription-card">
                      <div className="prescription-header">
                        <h3>Prescription #{rx.id.slice(-4)}</h3>
                        <span className={`status-badge ${rx.status}`}>{rx.status}</span>
                      </div>
                      <div className="prescription-details">
                        <p><strong>Patient:</strong> {patient?.name}</p>
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
                                <span className="med-instructions">
                                  <AlertCircle size={14} />
                                  {med.instructions}
                                </span>
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

        {activeTab === 'inventory' && (
          <div className="dashboard-content">
            <header className="page-header">
              <h1>Medication Inventory</h1>
              <button className="btn btn-primary">
                Add Medication
              </button>
            </header>

            <div className="inventory-grid">
              {[
                { name: 'Amoxicillin', stock: 150, category: 'Antibiotic', price: '$12.99' },
                { name: 'Paracetamol', stock: 300, category: 'Pain Relief', price: '$5.99' },
                { name: 'Aspirin', stock: 200, category: 'Pain Relief', price: '$8.99' },
                { name: 'Ibuprofen', stock: 180, category: 'Anti-inflammatory', price: '$10.99' },
                { name: 'Metformin', stock: 120, category: 'Diabetes', price: '$15.99' },
                { name: 'Lisinopril', stock: 90, category: 'Blood Pressure', price: '$18.99' },
              ].map((med, idx) => (
                <div key={idx} className="inventory-card">
                  <div className="inventory-icon">
                    <Pill size={24} />
                  </div>
                  <div className="inventory-info">
                    <h3>{med.name}</h3>
                    <p className="inventory-category">{med.category}</p>
                    <div className="inventory-stock">
                      <span className={`stock-badge ${med.stock < 100 ? 'low' : 'good'}`}>
                        {med.stock} in stock
                      </span>
                    </div>
                    <p className="inventory-price">{med.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
