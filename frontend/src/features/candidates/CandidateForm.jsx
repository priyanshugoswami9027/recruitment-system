
import { useState } from 'react';
import API from "../../api";

export default function CandidateForm({ initialData = null, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    experienceYears: initialData?.experienceYears || '',
    currentRole: initialData?.currentRole || '',
    bio: initialData?.bio || '',
  });

  const [skills, setSkills] = useState(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(',', '');
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput('');
    }
  };

 
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append('skills', JSON.stringify(skills));
      if (resume) {
        data.append('resume', resume);
      }

      const endpoint = initialData ? `/v1/candidates/${initialData._id}` : '/v1/candidates';
      const method = initialData ? 'PUT' : 'POST';

      await API({
        method,
        url: endpoint,
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ type: 'success', text: 'Candidate profile saved successfully!' });
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {initialData ? 'Edit Candidate Profile' : 'Create Candidate Profile'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Fill in your professional details and key technical skills.
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 rounded-lg p-4 text-sm border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Priyanshu Goswami"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Current Role / Title</label>
            <input
              type="text"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Full-Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Years of Experience</label>
            <input
              type="number"
              step="0.1"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              placeholder="2"
            />
          </div>
        </div>

        {/* Skills Tag Input Section */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Skills (Type and press Enter)
          </label>
          <div className="rounded-lg bg-slate-800 border border-slate-700 p-2 flex flex-wrap gap-2 items-center focus-within:border-indigo-500">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-indigo-400 hover:text-indigo-200 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder={skills.length === 0 ? "e.g., React, Node.js, MongoDB" : "Add more..."}
              className="flex-1 bg-transparent px-2 py-1 text-sm text-white placeholder-slate-500 focus:outline-none min-w-[140px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Short Professional Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            placeholder="Passionate full-stack developer building scalable web architectures..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {loading ? 'Saving Profile...' : 'Save Candidate Profile'}
        </button>
      </form>
    </div>
  );
}
