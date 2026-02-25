import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Activity, User, Mail, Lock, Shield, Stethoscope, UserCog } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    // Patient-specific fields
    dateOfBirth: '',
    bloodType: '',
    allergies: '',
    // Doctor-specific fields
    specialty: '',
    licenseNumber: '',
    // Pharmacist-specific fields
    pharmacy: '',
    pharmacistLicense: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, users } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    setLoading(true);

    // Prepare user data based on role
    const userData = {
      id: `${formData.role}-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Add role-specific fields
    if (formData.role === 'patient') {
      userData.dateOfBirth = formData.dateOfBirth;
      userData.bloodType = formData.bloodType;
      userData.allergies = formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [];
    } else if (formData.role === 'doctor') {
      userData.specialty = formData.specialty;
      userData.licenseNumber = formData.licenseNumber;
    } else if (formData.role === 'pharmacist') {
      userData.pharmacy = formData.pharmacy;
      userData.licenseNumber = formData.pharmacistLicense;
    }

    const result = signup(userData);
    
    if (result.success) {
      // Navigate based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        case 'pharmacist':
          navigate('/pharmacist');
          break;
        default:
          navigate('/login');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'patient':
        return (
          <>
            <div className="form-group">
              <label>
                <User size={18} />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Type</label>
              <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <User size={18} />
                Allergies (comma-separated)
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., Penicillin, Peanuts"
              />
            </div>
          </>
        );
      case 'doctor':
        return (
          <>
            <div className="form-group">
              <label>
                <Stethoscope size={18} />
                Specialty
              </label>
              <select name="specialty" value={formData.specialty} onChange={handleChange} required>
                <option value="">Select Specialty</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Oncology">Oncology</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <Shield size={18} />
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="Enter your medical license number"
                required
              />
            </div>
          </>
        );
      case 'pharmacist':
        return (
          <>
            <div className="form-group">
              <label>
                <UserCog size={18} />
                Pharmacy Name
              </label>
              <input
                type="text"
                name="pharmacy"
                value={formData.pharmacy}
                onChange={handleChange}
                placeholder="Enter pharmacy name"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <Shield size={18} />
                License Number
              </label>
              <input
                type="text"
                name="pharmacistLicense"
                value={formData.pharmacistLicense}
                onChange={handleChange}
                placeholder="Enter pharmacist license number"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-bg-pattern"></div>
      </div>
      
      <div className="login-card signup-card">
        <div className="login-header">
          <div className="login-logo">
            <Activity size={40} />
          </div>
          <h1>Arogyaa</h1>
          <p>Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <User size={18} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Shield size={18} />
              Account Type
            </label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>

          {renderRoleSpecificFields()}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-link">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
