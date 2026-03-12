import { Link } from 'react-router-dom';
import { Users, Code, Zap, Trophy, Search, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Background Orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="hero-badge animate-fade-in">🚀 The #1 Hackathon Team Platform</div>
          <h1 className="hero-title animate-fade-in">
            Find Your Next <span className="highlight">Hackathon Dream Team</span>
          </h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Connect with developers, designers, and innovators from around the world. Build incredible projects and launch your startup journey.
          </p>
          <div className="hero-cta animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup" className="btn-primary hero-btn">
              Join the Team <ArrowRight size={18} />
            </Link>
            <Link to="/discovery" className="btn-secondary hero-btn">
              <Search size={18} /> Browse Hackers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-number">500+</div>
              <div className="stat-label">Hackers Registered</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-number">120+</div>
              <div className="stat-label">Teams Formed</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-number">80+</div>
              <div className="stat-label">Skills Available</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-number">40+</div>
              <div className="stat-label">Hackathons Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Users size={32} /></div>
              <h3>1. Create Your Profile</h3>
              <p>Sign up and showcase your skills, roles, and university. Let others know what you bring to the table.</p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Zap size={32} /></div>
              <h3>2. Find Matches</h3>
              <p>Filter through our exclusive hacker database to find the perfect teammate by skill or experience level.</p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Code size={32} /></div>
              <h3>3. Build Together</h3>
              <p>Connect with your new teammates and start building your next award-winning hackathon project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teams CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-panel">
            <Trophy size={40} className="cta-icon" />
            <h2>Ready to Form a Team?</h2>
            <p>Create or join an open team and get ready to win your next hackathon.</p>
            <div className="hero-cta">
              <Link to="/teams" className="btn-primary hero-btn">
                Browse Teams <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="btn-secondary hero-btn">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
