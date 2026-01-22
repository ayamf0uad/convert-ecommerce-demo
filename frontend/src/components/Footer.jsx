import { Github, ExternalLink } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">LUXE<span className="logo-dot">.</span></span>
          <p className="footer-tagline">
            A fullstack demo showcasing Convert.com's JavaScript SDK for feature flags, 
            A/B testing, and conversion tracking.
          </p>
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <a 
            href="https://convertcom.github.io/javascript-sdk/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            SDK Documentation <ExternalLink size={14} />
          </a>
          <a 
            href="https://github.com/convertcom/javascript-sdk" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Github size={14} /> GitHub Repository
          </a>
          <a 
            href="https://www.convert.com/fullstack/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Convert Fullstack <ExternalLink size={14} />
          </a>
        </div>

        <div className="footer-tech">
          <h4>Built With</h4>
          <div className="tech-stack">
            <span>React</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>Convert SDK</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Demo project for educational purposes • Not affiliated with Convert.com</p>
      </div>
    </footer>
  );
}

export default Footer;
