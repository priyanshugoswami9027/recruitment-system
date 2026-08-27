
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            RecruitPro AI
          </span>
          <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
            {user?.role}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-300">Hello, <strong className="text-white">{user?.username}</strong></span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600/10 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/20 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Manage candidates, reviews, and recruitment pipelines seamlessly.</p>
        </div>

        {/* Role-Specific Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-400">Total Candidates</h3>
            <p className="text-3xl font-bold mt-2">248</p>
            <p className="text-xs text-slate-500 mt-1">+12% from last month</p>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-cyan-400">Active Applications</h3>
            <p className="text-3xl font-bold mt-2">42</p>
            <p className="text-xs text-slate-500 mt-1">Pending review stage</p>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-emerald-400">Hired Candidates</h3>
            <p className="text-3xl font-bold mt-2">18</p>
            <p className="text-xs text-slate-500 mt-1">Successfully onboarded</p>
          </div>
        </div>

        {/* Conditional section based on role */}
        <div className="mt-10 rounded-xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {user?.role === 'CANDIDATE' ? (
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 transition">
                Update My Candidate Profile
              </button>
            ) : (
              <>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 transition">
                  Search Candidate Database
                </button>
                <button className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition">
                  Filter by Skills & Experience
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}