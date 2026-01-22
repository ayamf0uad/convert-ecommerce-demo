import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useConvert } from '../context/ConvertContext';
import api from '../api';
import './CartPage.css';

function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { visitorId, isReady, runFeatures, trackPurchase } = useConvert();
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    async function loadCart() {
      if (!isReady || !visitorId) return;

      try {
        setLoading(true);
        
        const cartItems = items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }));
        
        const data = await api.getCartPage(visitorId, cartItems);
        setCartData(data);
        
        await runFeatures('cart');
        
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [visitorId, isReady, items, runFeatures]);

  const handleCheckout = async () => {
    if (!cartData?.cart) return;
    
    setCheckingOut(true);
    
    // Simulate checkout delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Track purchase conversion
    const transactionId = `txn_${Date.now()}`;
    await trackPurchase(
      cartData.cart.total,
      items.reduce((sum, item) => sum + item.quantity, 0),
      transactionId
    );
    
    clearCart();
    setOrderComplete(true);
    setCheckingOut(false);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading cart...</p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="order-complete">
            <div className="complete-icon">🎉</div>
            <h1>Order Complete!</h1>
            <p>Thank you for your purchase. A conversion event has been tracked.</p>
            <div className="complete-details">
              <p>Goal: <code>purchase</code></p>
              <p>Amount: <code>${cartData?.cart?.total?.toFixed(2)}</code></p>
            </div>
            <Link to="/products" className="continue-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cart = cartData?.cart;
  const features = cartData?.features || [];
  const discountFeature = features.find(f => f.key === 'discount-banner');

  return (
    <div className="cart-page">
      <div className="container">
        <header className="cart-header">
          <Link to="/products" className="back-link">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
          <h1>Your Cart</h1>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={64} strokeWidth={1} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items yet.</p>
            <Link to="/products" className="shop-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              {/* Discount Banner (A/B Test) */}
              {cart?.discountApplied && (
                <div className="discount-banner">
                  <Tag size={20} />
                  <div className="discount-info">
                    <strong>{cart.discountPercent}% Off Applied!</strong>
                    <span>Use code <code>{cart.promoCode}</code> at checkout</span>
                  </div>
                  <span className="discount-amount">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Show notice if discount feature is active but not applied */}
              {discountFeature?.status === 'enabled' && !cart?.discountApplied && (
                <div className="discount-pending-banner">
                  <Tag size={20} />
                  <div className="discount-info">
                    <strong>Unlock {discountFeature.variables?.discount_percent}% Off!</strong>
                    <span>Add ${(discountFeature.variables?.minimum_order - cart.subtotal).toFixed(2)} more to qualify</span>
                  </div>
                </div>
              )}

              <div className="cart-items">
                {items.map(item => (
                  <div key={item.productId} className="cart-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cart?.subtotal?.toFixed(2)}</span>
                </div>

                {cart?.discountApplied && (
                  <div className="summary-row discount">
                    <span>Discount ({cart.discountPercent}%)</span>
                    <span>-${cart.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${cart?.total?.toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <>
                    <div className="btn-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Checkout (Demo)
                  </>
                )}
              </button>

              <p className="checkout-note">
                This is a demo. Clicking checkout will track a purchase conversion event.
              </p>
            </div>
          </div>
        )}

        {/* Active Test Info */}
        {items.length > 0 && (
          <section className="cart-test-info">
            <h3>Active A/B Test</h3>
            <div className="test-card">
              <h4>Cart Discount Banner</h4>
              <p>Testing whether showing discount offers increases cart conversion rates</p>
              <div className="test-status">
                Status: <span className={discountFeature?.status === 'enabled' ? 'enabled' : 'control'}>
                  {discountFeature?.status === 'enabled' ? 'Discount Feature Active' : 'Control (No Discount)'}
                </span>
              </div>
              {discountFeature?.status === 'enabled' && (
                <div className="test-variables">
                  <code>discount_percent: {discountFeature.variables?.discount_percent}%</code>
                  <code>minimum_order: ${discountFeature.variables?.minimum_order}</code>
                  <code>promo_code: {discountFeature.variables?.promo_code}</code>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default CartPage;
