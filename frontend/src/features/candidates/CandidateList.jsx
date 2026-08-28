
import { useState, useEffect } from 'react';
import API from "../../api";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 
  const availableSkills = ['React', 'Node.js', 'Java', 'Spring Boot', 'MongoDB', 'Python'];


  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await API.get('/candidates', {
        params: {
          search: searchQuery,
          skill: selectedSkill,
          page: page,
          limit: 6,
        },
      });
      setCandidates(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [searchQuery, selectedSkill, page]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Candidate Database</h1>
        <p className="text-slate-400 mt-1">Search and filter potential hires by name, role, or technical stack.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or current role..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to page 1 on new search
          }}
          className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
        />

        {/* Skill Filter Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => { setSelectedSkill(''); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedSkill === '' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Skills
          </button>
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => { setSelectedSkill(skill); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                selectedSkill === skill ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Loading candidates...</div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-lg text-slate-400">No candidates found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{candidate.fullName}</h3>
                    <p className="text-sm text-indigo-400 font-medium">{candidate.currentRole || 'Full-Stack Developer'}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    {candidate.experienceYears} yrs exp
                  </span>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {candidate.bio || 'No professional bio provided yet.'}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {candidate.skills?.map((skill, idx) => (
                    <span key={idx} className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500">Phone: {candidate.phone || 'N/A'}</span>
                <a
                  href={`#`} 
                  className="rounded-lg bg-indigo-600/10 border border-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
                >
                  View Resume
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-sm font-semibold disabled:opacity-30 hover:bg-slate-800 transition"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-sm font-semibold disabled:opacity-30 hover:bg-slate-800 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}