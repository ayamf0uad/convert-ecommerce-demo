import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Zap, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useConvert } from '../context/ConvertContext';
import api from '../api';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { visitorId, isReady, trackProductView, trackAddToCart, runFeatures } = useConvert();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    async function loadProduct() {
      if (!isReady || !visitorId) return;

      try {
        setLoading(true);
        
        // Fetch product details
        const { product: productData } = await api.getProduct(id);
        setProduct(productData);
        
        // Run features for product page location
        const featureResults = await runFeatures('product');
        const featuresMap = {};
        featureResults.forEach(f => {
          featuresMap[f.key] = f;
        });
        setFeatures(featuresMap);
        
        // Track product view
        await trackProductView(id);
        
        // Get related products
        const { recommendations } = await api.getRecommendations('popular', 4, [id]);
        setRelatedProducts(recommendations);
        
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, visitorId, isReady, trackProductView, runFeatures]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
    
    await trackAddToCart(product.id, product.price, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuickBuy = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <Link to="/products" className="back-btn">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  const quickBuyEnabled = features['quick-buy']?.variables?.enabled;
  const upsellEnabled = features['product-upsell']?.status === 'enabled';
  const urgencyEnabled = features['urgency-messaging']?.status === 'enabled';

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-layout">
          {/* Product Image */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
              {urgencyEnabled && product.stock < 20 && (
                <div className="urgency-badge">
                  🔥 Only {product.stock} left!
                </div>
              )}
            </div>
            <div className="image-actions">
              <button className="action-btn" title="Add to Wishlist">
                <Heart size={20} />
              </button>
              <button className="action-btn" title="Share">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <span className="product-category">{product.category.toUpperCase()}</span>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <Star size={18} fill="var(--color-accent)" stroke="var(--color-accent)" />
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-price-section">
              <span className="product-price">${product.price.toFixed(2)}</span>
              {urgencyEnabled && (
                <span className="price-note">Price may increase soon</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              
              {quickBuyEnabled && (
                <button className="quick-buy-btn" onClick={handleQuickBuy}>
                  <Zap size={20} />
                  Buy Now
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <Truck size={18} />
                <span>Free Shipping</span>
              </div>
              <div className="badge">
                <Shield size={18} />
                <span>2-Year Warranty</span>
              </div>
              <div className="badge">
                <RotateCcw size={18} />
                <span>30-Day Returns</span>
              </div>
            </div>

            {/* Upsell Section (A/B Test) */}
            {upsellEnabled && (
              <div className="upsell-section">
                <h4>🎁 Frequently Bought Together</h4>
                <p>Add for 15% off your entire order</p>
                <div className="upsell-products">
                  {relatedProducts.slice(0, 2).map(p => (
                    <div key={p.id} className="upsell-item">
                      <img src={p.image} alt={p.name} />
                      <span>{p.name.slice(0, 20)}...</span>
                      <span className="upsell-price">${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>You Might Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="related-card">
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <div className="related-meta">
                    <span className="related-price">${p.price.toFixed(2)}</span>
                    <span className="related-rating">
                      <Star size={14} fill="var(--color-accent)" stroke="var(--color-accent)" />
                      {p.rating}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Test Info */}
        <section className="product-test-info">
          <h3>Active A/B Tests on This Page</h3>
          <div className="test-cards">
            <div className="test-card">
              <h4>Quick Buy Button</h4>
              <p>Testing whether a "Buy Now" button increases conversions</p>
              <div className={`test-status ${quickBuyEnabled ? 'enabled' : 'control'}`}>
                {quickBuyEnabled ? '✓ Enabled' : '○ Control'}
              </div>
            </div>
            <div className="test-card">
              <h4>Urgency Messaging</h4>
              <p>Testing low-stock warnings and price urgency</p>
              <div className={`test-status ${urgencyEnabled ? 'enabled' : 'control'}`}>
                {urgencyEnabled ? '✓ Enabled' : '○ Control'}
              </div>
            </div>
            <div className="test-card">
              <h4>Product Upsell</h4>
              <p>Testing "Frequently Bought Together" recommendations</p>
              <div className={`test-status ${upsellEnabled ? 'enabled' : 'control'}`}>
                {upsellEnabled ? '✓ Enabled' : '○ Control'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;
