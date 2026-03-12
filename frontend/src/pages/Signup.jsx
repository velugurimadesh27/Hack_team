import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', github_link: '',
    university: '', location: '', bio: '', experience_level: 'Beginner',
    skills: '', roles: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      roles: formData.roles.split(',').map(r => r.trim()).filter(Boolean),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', payload);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '800px', padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>Join HackBuild</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Create your hacker profile and start finding teammates today.
        </p>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Basic Info</h3>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '1rem' }}>Background</h3>
          </div>

          <div className="form-group">
            <label>University / College</label>
            <input type="text" name="university" className="form-control" value={formData.university} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country / Location</label>
            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>GitHub Profile Link</label>
            <input type="url" name="github_link" className="form-control" placeholder="https://github.com/username" value={formData.github_link} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select name="experience_level" className="form-control" value={formData.experience_level} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '1rem' }}>Skills & Roles</h3>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Skills (comma separated, e.g. React, Node.js, Python)</label>
            <input type="text" name="skills" className="form-control" value={formData.skills} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Preferred Roles (comma separated, e.g. Frontend, Backend, UI/UX)</label>
            <input type="text" name="roles" className="form-control" value={formData.roles} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Short Bio</label>
            <textarea name="bio" className="form-control" rows="3" placeholder="Tell us about your interests and past projects..." value={formData.bio} onChange={handleChange}></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
              Already a member? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
