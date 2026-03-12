import { useState, useEffect } from 'react';
import { Search, MapPin, GraduationCap, Github } from 'lucide-react';
import axios from 'axios';
import './Discovery.css';

const Discovery = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    search: '', role: '', skill: '', experience: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.experience) params.append('experience', filters.experience);
      
      const response = await axios.get(`http://localhost:5000/api/discovery?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch teammates. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div className="discovery-header text-center animate-fade-in" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Find Your <span className="highlight" style={{ background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Teammates</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Search for developers, designers, and brainstormers to build something amazing.
        </p>
      </div>

      <div className="glass-panel search-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Keyword / Name</label>
            <div style={{ position: 'relative' }}>
              <input type="text" className="form-control" placeholder="e.g. John Doe, AI Enthusiast" value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
              <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-secondary)' }} />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Specific Skill</label>
            <input type="text" className="form-control" placeholder="e.g. React" value={filters.skill} onChange={e => setFilters({...filters, skill: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Role</label>
            <input type="text" className="form-control" placeholder="e.g. Backend Developer" value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Experience</label>
            <select className="form-control" value={filters.experience} onChange={e => setFilters({...filters, experience: e.target.value})}>
              <option value="">Any Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ height: '42px' }}>Search</button>
        </form>
      </div>

      {error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '2rem' }}>{error}</div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Searching the database...</div>
      ) : (
        <div className="user-grid">
          {users.length > 0 ? users.map((user) => (
            <div key={user.id} className="user-card glass-panel">
              <div className="user-card-header">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <span className="exp-badge">{user.experience_level}</span>
                </div>
              </div>

              <p className="user-bio">{user.bio || 'No bio provided.'}</p>

              <div className="user-details-list">
                {user.university && <div><GraduationCap size={16} /> {user.university}</div>}
                {user.location && <div><MapPin size={16} /> {user.location}</div>}
              </div>

              <div className="tags-container">
                {user.roles && user.roles.map((role, i) => <span key={i} className="tag role-tag">{role}</span>)}
                {user.skills && user.skills.slice(0, 5).map((skill, i) => <span key={i} className="tag skill-tag">{skill}</span>)}
                {user.skills && user.skills.length > 5 && <span className="tag">+ {user.skills.length - 5} more</span>}
              </div>

              <div className="user-card-footer">
                {user.github_link && (
                  <a href={user.github_link} target="_blank" rel="noreferrer" className="github-link" title="GitHub Profile">
                    <Github size={20} />
                  </a>
                )}
                <a href={`mailto:${user.email}`} className="btn-primary contact-btn">Contact</a>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No hackers found matching your criteria. Try adjusting the filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discovery;
