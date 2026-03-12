import { Link } from 'react-router-dom';
import { Code2, Github, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <Code2 size={20} />
                        <span>HackBuild</span>
                    </Link>
                    <p className="footer-tagline">Connecting hackers. Building futures.</p>
                </div>

                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link to="/discovery">Find Teammates</Link>
                        <Link to="/teams">Browse Teams</Link>
                        <Link to="/signup">Join Now</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Account</h4>
                        <Link to="/login">Log In</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {currentYear} HackBuild — Made with <Heart size={14} className="heart-icon" /> for hackers everywhere.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
