import { Link } from 'react-router-dom';
import './PrivacyPage.css';

function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="container">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: January 2026</p>
        </header>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to LUXE ("we," "our," or "us"). We are committed to protecting 
              your personal information and your right to privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information 
              when you visit our website.
            </p>
            <p>
              <strong>Note:</strong> This is a demonstration website. No real personal 
              data is collected or stored. This privacy policy is for illustrative 
              purposes only.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            <h3>Information automatically collected</h3>
            <p>
              When you visit our website, we may automatically collect certain information 
              about your device and usage patterns, including:
            </p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages viewed and time spent</li>
              <li>IP address (anonymized)</li>
            </ul>

            <h3>Analytics and Testing</h3>
            <p>
              We use Convert.com's Fullstack SDK to conduct A/B tests and analyze 
              website performance. This includes:
            </p>
            <ul>
              <li>Anonymous visitor IDs (stored in browser localStorage)</li>
              <li>Experience participation data</li>
              <li>Conversion events (page views, add-to-cart, demo purchases)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Improve our website and user experience</li>
              <li>Conduct A/B tests to optimize content and features</li>
              <li>Analyze usage patterns and trends</li>
              <li>Ensure website security and prevent fraud</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              We use localStorage to maintain your session and A/B test assignments 
              for a consistent experience. This includes:
            </p>
            <ul>
              <li><code>convert_visitor_id</code> - A unique identifier for testing purposes</li>
              <li><code>luxe_cart</code> - Your shopping cart contents</li>
            </ul>
            <p>
              You can clear this data at any time through your browser settings.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Third-Party Services</h2>
            <p>
              This demonstration site uses the following third-party services:
            </p>
            <ul>
              <li>
                <strong>Convert.com</strong> - A/B testing and optimization platform. 
                <a href="https://www.convert.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                  View their privacy policy
                </a>
              </li>
              <li>
                <strong>Unsplash</strong> - Product images. 
                <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer">
                  View their privacy policy
                </a>
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures 
              to protect your information. However, no method of transmission over the 
              Internet is 100% secure. As this is a demo site, we recommend not entering 
              any real personal information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics tracking</li>
              <li>Clear your browser's localStorage at any time</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our practices, 
              please contact us at:
            </p>
            <p className="contact-info">
              <strong>Email:</strong> privacy@luxe-demo.com (demo only)<br />
              <strong>Website:</strong> <Link to="/about">About LUXE</Link>
            </p>
          </section>

          <section className="privacy-section demo-disclaimer">
            <h2>⚠️ Demo Disclaimer</h2>
            <p>
              This is a demonstration e-commerce website built to showcase Convert.com's 
              Fullstack SDK. No real transactions are processed, and no real personal 
              data is collected or stored. The visitor ID used for A/B testing is a 
              randomly generated UUID stored only in your browser's localStorage.
            </p>
          </section>
        </div>

        <footer className="privacy-footer">
          <Link to="/" className="back-link">← Back to Home</Link>
        </footer>
      </div>
    </div>
  );
}

export default PrivacyPage;
