import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Activity, Shield, User, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);
    
    if (result.success) {
      switch (result.user.role) {
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

  const demoAccounts = [
    { role: 'Admin', email: 'admin@medisphere.com', password: 'admin123' },
    { role: 'Doctor', email: 'doctor@medisphere.com', password: 'doctor123' },
    { role: 'Patient', email: 'patient@medisphere.com', password: 'patient123' },
    { role: 'Pharmacist', email: 'pharmacist@medisphere.com', password: 'pharm123' },
  ];

  const fillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-bg-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Activity size={40} />
          </div>
          <h1>Arogyaa</h1>
          <p>Virtual Healthcare Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <User size={18} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Demo Accounts:</p>
          <div className="demo-buttons">
            {demoAccounts.map((demo) => (
              <button
                key={demo.role}
                onClick={() => fillDemo(demo)}
                className="demo-button"
              >
                {demo.role}
              </button>
            ))}
          </div>
        </div>

        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Create One</Link></p>
        </div>
      </div>
    </div>
  );
}
