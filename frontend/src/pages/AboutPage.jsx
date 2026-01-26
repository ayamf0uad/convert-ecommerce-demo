import { Link } from 'react-router-dom';
import { Users, Award, Truck, HeartHandshake } from 'lucide-react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About LUXE</h1>
          <p className="hero-tagline">
            Curating exceptional products for modern living since 2020
          </p>
        </section>

        {/* Our Story */}
        <section className="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              LUXE was born from a simple belief: everyone deserves access to 
              beautifully designed, high-quality products that enhance daily life. 
              What started as a small curated collection has grown into a destination 
              for those who appreciate thoughtful design and exceptional craftsmanship.
            </p>
            <p>
              We work directly with artisans and innovative brands around the world, 
              carefully selecting each item in our collection. Every product tells a 
              story of quality materials, sustainable practices, and timeless design.
            </p>
          </div>
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
              alt="LUXE Store" 
            />
          </div>
        </section>

        {/* Values */}
        <section className="about-values">
          <h2>What We Stand For</h2>
          <div className="values-grid">
            <div className="value-card">
              <Award className="value-icon" size={40} />
              <h3>Quality First</h3>
              <p>
                Every product is carefully vetted for durability, functionality, 
                and design excellence before joining our collection.
              </p>
            </div>
            <div className="value-card">
              <HeartHandshake className="value-icon" size={40} />
              <h3>Ethical Sourcing</h3>
              <p>
                We partner with brands that share our commitment to fair labor 
                practices and sustainable manufacturing.
              </p>
            </div>
            <div className="value-card">
              <Truck className="value-icon" size={40} />
              <h3>Fast & Free Shipping</h3>
              <p>
                Enjoy complimentary shipping on all orders, with most items 
                delivered within 3-5 business days.
              </p>
            </div>
            <div className="value-card">
              <Users className="value-icon" size={40} />
              <h3>Customer Care</h3>
              <p>
                Our dedicated team is here to help with any questions, from 
                product recommendations to order support.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Notice */}
        <section className="demo-notice">
          <h2>🧪 This is a Demo Store</h2>
          <p>
            LUXE is a demonstration e-commerce site built to showcase 
            <strong> Convert.com's Fullstack SDK</strong> for A/B testing and 
            feature flags. No real transactions are processed.
          </p>
          <p>
            The site demonstrates:
          </p>
          <ul>
            <li>Server-side A/B testing with feature flags</li>
            <li>Conversion tracking (product views, add-to-cart, purchases)</li>
            <li>Revenue tracking with transaction data</li>
            <li>Dynamic content personalization</li>
          </ul>
          <div className="demo-links">
            <a 
              href="https://convertcom.github.io/javascript-sdk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="demo-link"
            >
              View SDK Documentation →
            </a>
            <a 
              href="https://www.convert.com/fullstack/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="demo-link"
            >
              Learn About Convert Fullstack →
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h2>Ready to Explore?</h2>
          <p>Browse our collection of premium products.</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
