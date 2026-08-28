import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* AuthProvider ab Router ke andar hai taaki routing hooks use ho sakein */}
      <AuthProvider>
        <Routes>
          {/* Default Route: Direct URL aane par dashboard bhejo (ProtectedRoute khud login bhej dega agar token nahi hoga) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Role-based) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECRUITER', 'CANDIDATE']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Future mein aur protected routes yahan add ho sakte hain */}
          </Route>

          {/* Fallback Redirect: Agar koi ulta-seedha URL dale */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}