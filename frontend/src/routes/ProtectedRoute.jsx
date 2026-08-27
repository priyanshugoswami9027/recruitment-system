import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-lg font-semibold animate-pulse">Loading session...</p>
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Forbidden</h1>
        <p className="text-gray-600 mb-4">You do not have permission to access this dashboard.</p>
        <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Go Back Home
        </a>
      </div>
    );
  }

  
  return <Outlet />;
};

export default ProtectedRoute;