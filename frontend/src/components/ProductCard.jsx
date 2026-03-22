import { Star, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useConvert } from '../context/ConvertContext';
import './ProductCard.css';

function ProductCard({ product, quickBuy = null, index = 0 }) {
  const { addItem, openCart } = useCart();
  const { trackAddToCart, trackProductView, experiences } = useConvert();

  // Check if this visitor is in the buggy variant of quick-buy-test.
  // experiences['Product Listing'] is the cached result from runExperiences()
  // for the Product Listing location - set up in the original build session.
  const productListingExperiences = experiences['Product Listing'] || [];
  const quickBuyExp = productListingExperiences.find(
    e => e.experienceKey === 'quick-buy-test'
  );
  const isWithQuickBuyVariant = quickBuyExp?.variationKey === 'with-quick-buy';

  const handleAddToCart = () => {
    addItem(product);
    trackAddToCart(product.id, product.price);
    openCart();
  };

  const handleQuickBuy = () => {
    addItem(product);
    trackAddToCart(product.id, product.price);
    openCart();
  };

  const handleProductClick = () => {
    trackProductView(product.id);
  };

  return (
    <article 
      className="product-card"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={handleProductClick}
    >
      <div className="product-image-container">

        {isWithQuickBuyVariant ? (
          // BUG 1 (variant only): broken image src — 404 on all product cards
          // BUG 2 (variant only): alt attribute missing — accessibility violation
          <img
            src="/images/products/missing-image.jpg"
            className="product-image"
            loading="lazy"
          />
        ) : (
          // Control: image works correctly
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        )}

        <div className="product-overlay">
          {isWithQuickBuyVariant ? (
            // BUG 3 (variant only): Add to Cart button is disabled — critical CTA broken
            <button
              className="add-to-cart-btn"
              disabled
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          ) : (
            // Control: button works correctly
            <button
              className="add-to-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          )}

          {quickBuy?.enabled && (
            <button
              className="quick-buy-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickBuy();
              }}
            >
              <Zap size={18} />
              {quickBuy.buttonText}
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <Star size={14} fill="var(--color-accent)" stroke="var(--color-accent)" />
          <span>{product.rating}</span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-price">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
