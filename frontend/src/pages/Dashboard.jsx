import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, GraduationCap, Briefcase, Github, Edit2, Save } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit form state
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setFormData({
          ...response.data,
          skills: response.data.skills.join(', '),
          roles: response.data.roles.join(', ')
        });
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      roles: formData.roles.split(',').map(r => r.trim()).filter(Boolean),
    };

    try {
      const token = localStorage.getItem('token');
      await api.put('/api/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile({
        ...formData,
        skills: payload.skills,
        roles: payload.roles
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div className="container" style={{ paddingTop: '4rem', color: 'var(--danger)', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem' }}>Your Profile</h1>
          {!isEditing ? (
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
            <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
              <Save size={18} /> Save Changes
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{profile.name}</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>{profile.experience_level} Hacker</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                {profile.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18} /> {profile.email}</div>}
                {profile.location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {profile.location}</div>}
                {profile.university && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GraduationCap size={18} /> {profile.university}</div>}
                {profile.github_link && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Github size={18} /> <a href={profile.github_link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>GitHub Profile</a></div>}
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About Me</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{profile.bio}</p>
              </div>
            )}

            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Skills & Roles</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                    <span key={index} style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-primary)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {skill}
                    </span>
                  )) : <span style={{ color: 'var(--text-secondary)' }}>No skills listed.</span>}
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Roles</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.roles.length > 0 ? profile.roles.map((role, index) => (
                    <span key={index} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {role}
                    </span>
                  )) : <span style={{ color: 'var(--text-secondary)' }}>No roles listed.</span>}
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Edit form fields */}
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="form-control" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>University / College</label>
              <input type="text" className="form-control" value={formData.university || ''} onChange={(e) => setFormData({...formData, university: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-control" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="form-group">
              <label>GitHub Link</label>
              <input type="url" className="form-control" value={formData.github_link || ''} onChange={(e) => setFormData({...formData, github_link: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select className="form-control" value={formData.experience_level || 'Beginner'} onChange={(e) => setFormData({...formData, experience_level: e.target.value})}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Skills (comma separated)</label>
              <input type="text" className="form-control" value={formData.skills || ''} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Roles (comma separated)</label>
              <input type="text" className="form-control" value={formData.roles || ''} onChange={(e) => setFormData({...formData, roles: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Bio</label>
              <textarea className="form-control" rows="4" value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleUpdate}>Save Changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
