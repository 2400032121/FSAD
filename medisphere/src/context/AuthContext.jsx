import { createContext, useState } from 'react';
import { initialData } from '../data/mockData';

// Demo accounts that should always be available
const demoAccounts = [
  { id: 'admin-1', email: 'admin@medisphere.com', password: 'admin123', name: 'System Admin', role: 'admin', createdAt: '2024-01-01' },
  { id: 'doctor-1', email: 'doctor@medisphere.com', password: 'doctor123', name: 'Dr. Sarah Johnson', role: 'doctor', specialty: 'General Medicine', licenseNumber: 'MD-12345', createdAt: '2024-01-15' },
  { id: 'patient-1', email: 'patient@medisphere.com', password: 'patient123', name: 'John Smith', role: 'patient', dateOfBirth: '1990-05-20', phone: '555-0101', address: '123 Main St, City, State 12345', createdAt: '2024-02-01' },
  { id: 'pharmacist-1', email: 'pharmacist@medisphere.com', password: 'pharm123', name: 'Mike Williams', role: 'pharmacist', licenseNumber: 'RPH-67890', pharmacyName: 'MediCare Pharmacy', createdAt: '2024-01-20' }
];

// Merge demo accounts with existing users
const mergeUsersWithDemo = (existingUsers) => {
  const demoEmails = demoAccounts.map(d => d.email);
  const usersWithoutDemo = existingUsers.filter(u => !demoEmails.includes(u.email));
  return [...demoAccounts, ...usersWithoutDemo];
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('medisphere_users');
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : initialData.users;
    // Always ensure demo accounts are present
    return mergeUsersWithDemo(existingUsers);
  });
  const [loading] = useState(() => {
    // Initialize localStorage if it doesn't exist
    const storedUsers = localStorage.getItem('medisphere_users');
    if (!storedUsers) {
      localStorage.setItem('medisphere_users', JSON.stringify(initialData.users));
    }
    return false;
  });

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
  };

  const signup = (newUser) => {
    // Check if email already exists
    if (users.some(u => u.email === newUser.email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('medisphere_users', JSON.stringify(updatedUsers));
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const updateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
  };

  const addUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('medisphere_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('medisphere_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      loading, 
      login, 
      logout,
      signup,
      updateUser, 
      addUser, 
      deleteUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
