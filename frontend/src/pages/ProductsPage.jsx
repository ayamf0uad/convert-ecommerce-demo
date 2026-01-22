import { useState, useEffect } from 'react';
import { useConvert } from '../context/ConvertContext';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

function ProductsPage() {
  const { visitorId, isReady, runFeatures } = useConvert();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { key: null, label: 'All' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'accessories', label: 'Accessories' },
    { key: 'home', label: 'Home' }
  ];

  useEffect(() => {
    async function loadProducts() {
      if (!isReady || !visitorId) return;

      try {
        setLoading(true);
        
        const data = await api.getProductsPage(visitorId, {}, selectedCategory);
        setPageData(data);
        
        await runFeatures('products');
        
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [visitorId, isReady, selectedCategory, runFeatures]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  const { products, quickBuy, recommendations } = pageData || {};

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <header className="page-header">
          <h1>Shop</h1>
          <p>Discover our curated collection of premium products</p>
        </header>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat.key || 'all'}
              className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Buy Feature Flag Notice */}
        {quickBuy?.enabled && (
          <div className="feature-active-notice">
            <span className="notice-badge">⚡ Feature Active</span>
            <span>Quick Buy button enabled for this visitor</span>
          </div>
        )}

        {/* Main Products Grid */}
        <section className="main-products">
          <div className="products-grid">
            {products?.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                quickBuy={quickBuy}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        {recommendations?.products?.length > 0 && (
          <section className="recommendations-section">
            <div className="recommendations-header">
              <h2>
                {recommendations.algorithm === 'popular' && '🔥 Popular Right Now'}
                {recommendations.algorithm === 'personalized' && '✨ Picked For You'}
                {recommendations.algorithm === 'trending' && '📈 Trending'}
              </h2>
              <span className="algorithm-badge">
                Algorithm: {recommendations.algorithm}
              </span>
            </div>

            <div className="recommendations-grid">
              {recommendations.products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  quickBuy={quickBuy}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Active Tests Info */}
        <section className="tests-info">
          <h3>Active A/B Tests on This Page</h3>
          <div className="test-cards">
            <div className="test-card">
              <h4>Quick Buy Button</h4>
              <p>Testing whether a quick purchase button increases conversion rates</p>
              <div className="test-status">
                Status: <span className={quickBuy?.enabled ? 'enabled' : 'control'}>
                  {quickBuy?.enabled ? 'Enabled' : 'Control (Hidden)'}
                </span>
              </div>
            </div>

            <div className="test-card">
              <h4>Recommendation Algorithm</h4>
              <p>Comparing popular, personalized, and trending recommendation strategies</p>
              <div className="test-status">
                Active: <span className="enabled">{recommendations?.algorithm || 'N/A'}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductsPage;
