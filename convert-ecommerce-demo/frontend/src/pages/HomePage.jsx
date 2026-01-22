import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useConvert } from '../context/ConvertContext';
import api from '../api';
import ProductCard from '../components/ProductCard';
import SpecialDealsBanner from '../components/SpecialDealsBanner';
import './HomePage.css';

function HomePage() {
  const { visitorId, isReady, runFeatures } = useConvert();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    async function loadHomepage() {
      if (!isReady || !visitorId) return;

      try {
        setLoading(true);
        
        // Fetch homepage data with features
        const data = await api.getHomepage(visitorId);
        setPageData(data);
        
        // Also run features to update context
        await runFeatures('homepage');
        
      } catch (error) {
        console.error('Failed to load homepage:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, [visitorId, isReady, runFeatures]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading experience...</p>
      </div>
    );
  }

  const { specialDeals, featuredProducts } = pageData || {};

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
        </div>
        
        <div className="container hero-content">
          <span className="hero-eyebrow">
            <Sparkles size={16} />
            Convert SDK Demo
          </span>
          <h1 className="hero-title">
            Experience the Future of<br />
            <span className="highlight">A/B Testing</span>
          </h1>
          <p className="hero-description">
            This demo showcases Convert.com's JavaScript SDK for fullstack experimentation. 
            Watch as feature flags, A/B tests, and conversion tracking work seamlessly together.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">
              Shop Collection
              <ArrowRight size={18} />
            </Link>
            <a 
              href="https://convertcom.github.io/javascript-sdk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View SDK Docs
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        {/* Special Deals Banner (A/B Test) */}
        {specialDeals?.enabled && (
          <SpecialDealsBanner 
            bannerText={specialDeals.bannerText}
            deals={specialDeals.deals}
          />
        )}

        {/* Feature Explanation */}
        {!specialDeals?.enabled && (
          <div className="feature-notice">
            <div className="notice-icon">🧪</div>
            <div className="notice-content">
              <h3>No Special Deals Banner?</h3>
              <p>
                You've been bucketed into the control group for the "Homepage Deals" A/B test. 
                Try resetting your visitor ID in the debug panel to potentially see a different variation.
              </p>
            </div>
          </div>
        )}

        {/* Featured Products */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts?.slice(0, 8).map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
        </section>

        {/* SDK Features Section */}
        <section className="sdk-features">
          <h2>What's Being Tested</h2>
          <p className="sdk-features-intro">
            This demo includes multiple Convert SDK features running simultaneously:
          </p>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-card-icon">🎯</div>
              <h3>Homepage Deals</h3>
              <p>3-way A/B test showing different promotional banners based on visitor bucketing</p>
              <span className="feature-location">Location: homepage</span>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">⚡</div>
              <h3>Quick Buy Button</h3>
              <p>Feature flag testing a new quick purchase flow on product cards</p>
              <span className="feature-location">Location: products</span>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🎲</div>
              <h3>Recommendation Algorithm</h3>
              <p>Testing popular vs personalized vs trending recommendation strategies</p>
              <span className="feature-location">Location: products</span>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">💰</div>
              <h3>Cart Discount</h3>
              <p>Testing promotional discount banner impact on cart conversion rates</p>
              <span className="feature-location">Location: cart</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
