import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trophy, Search, ChevronRight, X, UserPlus } from 'lucide-react';
import api from '../api';
import './Teams.css';

const Teams = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const isAuthenticated = !!localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        hackathon_name: '',
        max_members: 4,
        looking_for: '',
    });

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/teams');
            setTeams(response.data);
        } catch (err) {
            setError('Failed to load teams. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await api.post('/api/teams', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowCreateForm(false);
            setFormData({ name: '', description: '', hackathon_name: '', max_members: 4, looking_for: '' });
            fetchTeams();
            setJoinMessage('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create team.');
        }
    };

    const handleJoin = async (teamId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await api.post(
                `/api/teams/${teamId}/join`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setJoinMessage(response.data.message);
            fetchTeams();
            setTimeout(() => setJoinMessage(''), 3000);
        } catch (err) {
            setJoinMessage(err.response?.data?.error || 'Failed to join team.');
            setTimeout(() => setJoinMessage(''), 3000);
        }
    };

    const filteredTeams = teams.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.hackathon_name && t.hackathon_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getMemberColor = (count, max) => {
        const ratio = count / max;
        if (ratio >= 1) return 'var(--danger)';
        if (ratio >= 0.75) return '#f59e0b';
        return 'var(--success)';
    };

    return (
        <div className="container teams-page">
            {/* Header */}
            <div className="teams-header animate-fade-in">
                <div className="teams-header-text">
                    <h1>
                        Hackathon <span className="highlight">Teams</span>
                    </h1>
                    <p>Find a team to join or create yours and recruit the best hackers.</p>
                </div>
                <button
                    className="btn-primary create-team-btn"
                    onClick={() => {
                        if (!isAuthenticated) navigate('/login');
                        else setShowCreateForm(true);
                    }}
                >
                    <Plus size={18} /> Create Team
                </button>
            </div>

            {/* Join message toast */}
            {joinMessage && (
                <div className={`toast animate-fade-in ${joinMessage.includes('already') || joinMessage.includes('full') || joinMessage.includes('Failed') ? 'toast-error' : 'toast-success'}`}>
                    {joinMessage}
                </div>
            )}

            {/* Create Team Modal */}
            {showCreateForm && (
                <div className="modal-backdrop" onClick={() => setShowCreateForm(false)}>
                    <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><Trophy size={22} /> Create a New Team</h2>
                            <button className="close-btn" onClick={() => setShowCreateForm(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleCreate} className="create-form">
                            <div className="form-group">
                                <label>Team Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Code Ninjas"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Hackathon Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. HackMIT 2025"
                                    value={formData.hackathon_name}
                                    onChange={(e) => setFormData({ ...formData, hackathon_name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Max Team Size</label>
                                <select
                                    className="form-control"
                                    value={formData.max_members}
                                    onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                                >
                                    {[2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n}>{n} members</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Looking For (roles needed)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Frontend Dev, UI/UX Designer"
                                    value={formData.looking_for}
                                    onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Brief description of your team's idea and goals..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="teams-search glass-panel animate-fade-in">
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search teams by name, hackathon, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '44px' }}
                    />
                </div>
            </div>

            {/* Teams Grid */}
            {loading ? (
                <div className="teams-status">Loading teams...</div>
            ) : error && teams.length === 0 ? (
                <div className="teams-status teams-error">{error}</div>
            ) : filteredTeams.length === 0 ? (
                <div className="teams-status">
                    <Users size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                    <p>{searchTerm ? 'No teams match your search.' : 'No teams yet. Be the first to create one!'}</p>
                    {!searchTerm && (
                        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => isAuthenticated ? setShowCreateForm(true) : navigate('/login')}>
                            <Plus size={16} /> Create the First Team
                        </button>
                    )}
                </div>
            ) : (
                <div className="teams-grid animate-fade-in">
                    {filteredTeams.map((team) => {
                        const isFull = team.member_count >= team.max_members;
                        return (
                            <div key={team.id} className="team-card glass-panel">
                                <div className="team-card-top">
                                    <div className="team-avatar">
                                        {team.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="team-info">
                                        <h3>{team.name}</h3>
                                        {team.hackathon_name && (
                                            <span className="hackathon-badge">
                                                <Trophy size={12} /> {team.hackathon_name}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className="member-count"
                                        style={{ color: getMemberColor(team.member_count, team.max_members) }}
                                    >
                                        <Users size={14} /> {team.member_count}/{team.max_members}
                                    </span>
                                </div>

                                {team.description && (
                                    <p className="team-description">{team.description}</p>
                                )}

                                {team.looking_for && (
                                    <div className="team-looking-for">
                                        <span className="looking-label">Looking for:</span>
                                        <span className="looking-value">{team.looking_for}</span>
                                    </div>
                                )}

                                <div className="team-card-footer">
                                    <span className="team-owner">by {team.owner_name}</span>
                                    <button
                                        className={isFull ? 'btn-secondary team-join-btn disabled' : 'btn-primary team-join-btn'}
                                        onClick={() => !isFull && handleJoin(team.id)}
                                        disabled={isFull}
                                        title={isFull ? 'Team is full' : 'Join this team'}
                                    >
                                        {isFull ? 'Full' : <><UserPlus size={15} /> Join</>}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Teams;
