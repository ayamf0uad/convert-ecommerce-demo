import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useConvert } from '../context/ConvertContext';
import './SpecialDealsBanner.css';

function SpecialDealsBanner({ bannerText, deals }) {
  const { addItem, openCart } = useCart();
  const { trackAddToCart } = useConvert();

  if (!deals || deals.length === 0) return null;

  const handleAddDeal = (deal) => {
    const product = {
      id: deal.id,
      name: deal.name,
      price: deal.salePrice,
      image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop`
    };
    addItem(product);
    trackAddToCart(deal.id, deal.salePrice);
    openCart();
  };

  return (
    <section className="deals-banner">
      <div className="deals-glow" />
      
      <div className="deals-header">
        <div className="deals-icon">
          <Sparkles size={24} />
        </div>
        <h2 className="deals-title">{bannerText}</h2>
        <div className="deals-timer">
          <Clock size={16} />
          <span>Ends in 23:59:42</span>
        </div>
      </div>

      <div className="deals-grid">
        {deals.map((deal, index) => (
          <article 
            key={deal.id} 
            className="deal-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="deal-badge">{deal.badge}</span>
            
            <div className="deal-content">
              <h3 className="deal-name">{deal.name}</h3>
              
              <div className="deal-pricing">
                <span className="original-price">${deal.originalPrice}</span>
                <span className="sale-price">${deal.salePrice}</span>
              </div>

              <button 
                className="deal-cta"
                onClick={() => handleAddDeal(deal)}
              >
                Grab Deal <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SpecialDealsBanner;
