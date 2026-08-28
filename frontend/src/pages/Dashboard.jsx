import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CandidateForm from '../features/candidates/CandidateForm';
import CandidateList from '../features/candidates/CandidateList';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Active view track karne ke liye state
  const [activeView, setActiveView] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Main content render function
  const renderContent = () => {
    switch (activeView) {
      case 'list':
        return <CandidateList />;
      case 'add':
        return <CandidateForm />;
      case 'overview':
      default:
        return (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Dashboard Overview
              </h1>
              <p className="text-slate-400 mt-1">
                Manage candidates, reviews, and recruitment pipelines seamlessly.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group rounded-2xl bg-slate-900/40 border border-slate-800 p-6 backdrop-blur-sm hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-300">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Candidates</h3>
                <div className="flex items-baseline mt-4 space-x-2">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">248</p>
                  <p className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12%</p>
                </div>
              </div>

              <div className="group rounded-2xl bg-slate-900/40 border border-slate-800 p-6 backdrop-blur-sm hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Applications</h3>
                <div className="flex items-baseline mt-4 space-x-2">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">42</p>
                  <p className="text-xs text-slate-500">Pending review</p>
                </div>
              </div>

              <div className="group rounded-2xl bg-slate-900/40 border border-slate-800 p-6 backdrop-blur-sm hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-300">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Hired Candidates</h3>
                <div className="flex items-baseline mt-4 space-x-2">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">18</p>
                  <p className="text-xs text-slate-500">Onboarded</p>
                </div>
              </div>
            </div>

            {/* Quick Actions (Role Based) */}
            <div className="mt-10 rounded-2xl bg-slate-900/30 border border-slate-800/80 p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-6 text-white">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                {user?.role === 'CANDIDATE' ? (
                  <button 
                    onClick={() => setActiveView('add')}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    Update My Candidate Profile
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveView('list')}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                    >
                      Search Candidate Database
                    </button>
                    <button 
                      onClick={() => setActiveView('add')}
                      className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 shadow-lg hover:bg-slate-700 hover:text-white transition-all"
                    >
                      Add New Candidate
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1120] text-slate-200 overflow-hidden font-sans">
      
      {/*  Sidebar Left */}
      <aside className="w-64 border-r border-slate-800/60 bg-[#0B1120]/80 backdrop-blur-xl flex flex-col justify-between">
        <div>
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              RecruitPro AI
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveView('overview')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === 'overview' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            
            {/* Conditional Nav Items based on Role */}
            {user?.role !== 'CANDIDATE' && (
              <button
                onClick={() => setActiveView('list')}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeView === 'list' 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                Candidate List
              </button>
            )}

            <button
              onClick={() => setActiveView('add')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === 'add' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {user?.role === 'CANDIDATE' ? 'My Profile Form' : 'Add Candidate'}
            </button>
          </nav>
        </div>

        {/* User Info Bottom */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center space-x-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[120px]">{user?.username}</p>
              <p className="text-xs font-semibold text-indigo-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area (Right Side) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800/60 bg-[#0B1120]/80 backdrop-blur-md flex items-center justify-end px-8 z-10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-lg bg-red-500/10 border border-red-500/20 px-5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <span>Logout</span>
          </button>
        </header>

        {/* Dynamic Content Rendering */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
}