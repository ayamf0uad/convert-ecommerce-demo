import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Users, ShoppingCart, CreditCard, Eye, TrendingUp, Settings, Zap } from 'lucide-react';
import api from '../api';
import './TrafficSimulator.css';

// User journey types
const JOURNEY_TYPES = {
  BROWSER: {
    name: 'Browser',
    description: 'Views products but doesn\'t buy',
    icon: Eye,
    color: '#60a5fa',
    steps: ['homepage', 'products', 'product', 'products'],
    conversionChance: 0
  },
  CART_ABANDONER: {
    name: 'Cart Abandoner',
    description: 'Adds to cart but abandons',
    icon: ShoppingCart,
    color: '#f59e0b',
    steps: ['homepage', 'products', 'product', 'add_to_cart', 'cart'],
    conversionChance: 0
  },
  HESITANT_BUYER: {
    name: 'Hesitant Buyer',
    description: 'Multiple visits before purchase',
    icon: TrendingUp,
    color: '#8b5cf6',
    steps: ['homepage', 'products', 'product', 'products', 'product', 'add_to_cart', 'cart', 'purchase'],
    conversionChance: 0.7
  },
  QUICK_BUYER: {
    name: 'Quick Buyer',
    description: 'Fast path to purchase',
    icon: Zap,
    color: '#10b981',
    steps: ['homepage', 'products', 'product', 'add_to_cart', 'cart', 'purchase'],
    conversionChance: 0.9
  },
  POWER_SHOPPER: {
    name: 'Power Shopper',
    description: 'Multiple items, high value',
    icon: CreditCard,
    color: '#ec4899',
    steps: ['products', 'product', 'add_to_cart', 'products', 'product', 'add_to_cart', 'products', 'product', 'add_to_cart', 'cart', 'purchase'],
    conversionChance: 0.85
  }
};

// Products for simulation
const PRODUCT_IDS = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6', 'prod_7', 'prod_8'];

function TrafficSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState({
    visitorsPerMinute: 10,
    browserRatio: 30,
    abandonerRatio: 25,
    hesitantRatio: 20,
    quickBuyerRatio: 15,
    powerShopperRatio: 10,
    stepDelay: 500 // ms between steps
  });
  
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    totalAddToCarts: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    activeVisitors: 0,
    journeyBreakdown: {}
  });
  
  const [logs, setLogs] = useState([]);
  const [activeJourneys, setActiveJourneys] = useState([]);
  
  const intervalRef = useRef(null);
  const journeyIdRef = useRef(0);

  // Generate a unique visitor ID
  const generateVisitorId = () => `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Select journey type based on ratios
  const selectJourneyType = useCallback(() => {
    const total = config.browserRatio + config.abandonerRatio + config.hesitantRatio + 
                  config.quickBuyerRatio + config.powerShopperRatio;
    const rand = Math.random() * total;
    
    let cumulative = 0;
    if ((cumulative += config.browserRatio) >= rand) return 'BROWSER';
    if ((cumulative += config.abandonerRatio) >= rand) return 'CART_ABANDONER';
    if ((cumulative += config.hesitantRatio) >= rand) return 'HESITANT_BUYER';
    if ((cumulative += config.quickBuyerRatio) >= rand) return 'QUICK_BUYER';
    return 'POWER_SHOPPER';
  }, [config]);

  // Add log entry
  const addLog = useCallback((message, type = 'info') => {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);

  // Simulate a single step in a journey
  const simulateStep = useCallback(async (visitorId, step, cart = []) => {
    try {
      switch (step) {
        case 'homepage':
          await api.getHomepage(visitorId);
          return { tracked: 'page_view', location: 'homepage' };
          
        case 'products':
          await api.getProductsPage(visitorId);
          return { tracked: 'page_view', location: 'products' };
          
        case 'product':
          const productId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];
          await api.trackConversion(visitorId, 'product-view', { action: 'view_product' });
          return { tracked: 'product_view', productId };
          
        case 'add_to_cart':
          const cartProductId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];
          const { product } = await api.getProduct(cartProductId);
          await api.trackConversion(visitorId, 'add-to-cart', { action: 'add_to_cart' });
          return { 
            tracked: 'add_to_cart', 
            productId: cartProductId,
            price: product?.price || 50,
            cartItem: { id: cartProductId, price: product?.price || 50 }
          };
          
        case 'cart':
          await api.getCartPage(visitorId, cart.map(item => ({ productId: item.id, quantity: 1 })));
          return { tracked: 'page_view', location: 'cart' };
          
        case 'purchase':
          const total = cart.reduce((sum, item) => sum + (item.price || 50), 0) || 
                       (50 + Math.random() * 200);
          const productsCount = cart.length || Math.ceil(Math.random() * 3);
          const transactionId = `txn_sim_${Date.now()}`;
          
          await api.trackConversion(visitorId, 'purchase', 
            { action: 'purchase' },
            [
              { key: 'amount', value: Math.round(total * 100) / 100 },
              { key: 'productsCount', value: productsCount },
              { key: 'transactionId', value: transactionId }
            ]
          );
          return { tracked: 'purchase', amount: total, productsCount, transactionId };
          
        default:
          return { tracked: 'unknown' };
      }
    } catch (error) {
      console.error(`Error in step ${step}:`, error);
      return { tracked: 'error', error: error.message };
    }
  }, []);

  // Run a complete user journey
  const runJourney = useCallback(async (journeyType) => {
    const journey = JOURNEY_TYPES[journeyType];
    const visitorId = generateVisitorId();
    const journeyId = ++journeyIdRef.current;
    
    // Add to active journeys
    const journeyState = {
      id: journeyId,
      visitorId,
      type: journeyType,
      typeName: journey.name,
      color: journey.color,
      currentStep: 0,
      totalSteps: journey.steps.length,
      startTime: Date.now(),
      cart: []
    };
    
    setActiveJourneys(prev => [...prev, journeyState]);
    setStats(prev => ({ 
      ...prev, 
      totalVisitors: prev.totalVisitors + 1,
      activeVisitors: prev.activeVisitors + 1 
    }));
    
    addLog(`🚀 New ${journey.name} started (${visitorId.slice(-8)})`, 'start');

    // Execute each step
    for (let i = 0; i < journey.steps.length; i++) {
      const step = journey.steps[i];
      
      // Update current step
      setActiveJourneys(prev => 
        prev.map(j => j.id === journeyId ? { ...j, currentStep: i + 1 } : j)
      );

      // Run the step
      const result = await simulateStep(visitorId, step, journeyState.cart);
      
      // Update stats based on result
      if (result.tracked === 'page_view') {
        setStats(prev => ({ ...prev, totalPageViews: prev.totalPageViews + 1 }));
      } else if (result.tracked === 'product_view') {
        setStats(prev => ({ ...prev, totalPageViews: prev.totalPageViews + 1 }));
      } else if (result.tracked === 'add_to_cart') {
        journeyState.cart.push(result.cartItem);
        setStats(prev => ({ ...prev, totalAddToCarts: prev.totalAddToCarts + 1 }));
        addLog(`🛒 Add to cart: $${result.price?.toFixed(2) || '?.??'}`, 'cart');
      } else if (result.tracked === 'purchase') {
        setStats(prev => ({ 
          ...prev, 
          totalPurchases: prev.totalPurchases + 1,
          totalRevenue: prev.totalRevenue + result.amount
        }));
        addLog(`💰 Purchase: $${result.amount.toFixed(2)} (${result.productsCount} items)`, 'purchase');
      }

      // Delay between steps
      await new Promise(resolve => setTimeout(resolve, config.stepDelay));
      
      // Check for early exit (cart abandonment)
      if (step === 'cart' && journeyType === 'CART_ABANDONER') {
        addLog(`🚪 Cart abandoned (${visitorId.slice(-8)})`, 'abandon');
        break;
      }
      
      // Random chance to not complete purchase
      if (step === 'cart' && Math.random() > journey.conversionChance) {
        addLog(`🚪 Left at checkout (${visitorId.slice(-8)})`, 'abandon');
        break;
      }
    }

    // Remove from active journeys
    setActiveJourneys(prev => prev.filter(j => j.id !== journeyId));
    setStats(prev => ({ 
      ...prev, 
      activeVisitors: Math.max(0, prev.activeVisitors - 1),
      journeyBreakdown: {
        ...prev.journeyBreakdown,
        [journeyType]: (prev.journeyBreakdown[journeyType] || 0) + 1
      }
    }));
    
    addLog(`✓ ${journey.name} completed (${visitorId.slice(-8)})`, 'complete');
  }, [config.stepDelay, simulateStep, addLog]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setIsRunning(true);
    addLog('▶️ Simulation started', 'system');
    
    const interval = 60000 / config.visitorsPerMinute;
    
    intervalRef.current = setInterval(() => {
      const journeyType = selectJourneyType();
      runJourney(journeyType);
    }, interval);
  }, [config.visitorsPerMinute, selectJourneyType, runJourney, addLog]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addLog('⏹️ Simulation stopped', 'system');
  }, [addLog]);

  // Reset stats
  const resetStats = useCallback(() => {
    setStats({
      totalVisitors: 0,
      totalPageViews: 0,
      totalAddToCarts: 0,
      totalPurchases: 0,
      totalRevenue: 0,
      activeVisitors: 0,
      journeyBreakdown: {}
    });
    setLogs([]);
    setActiveJourneys([]);
    addLog('🔄 Stats reset', 'system');
  }, [addLog]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const conversionRate = stats.totalVisitors > 0 
    ? ((stats.totalPurchases / stats.totalVisitors) * 100).toFixed(1)
    : '0.0';
  
  const avgOrderValue = stats.totalPurchases > 0
    ? (stats.totalRevenue / stats.totalPurchases).toFixed(2)
    : '0.00';

  return (
    <div className="traffic-simulator">
      <div className="container">
        <header className="simulator-header">
          <div>
            <h1>🤖 Traffic Simulator</h1>
            <p>Simulate realistic user journeys to test your A/B experiments</p>
          </div>
          <div className="simulator-controls">
            {isRunning ? (
              <button className="control-btn stop" onClick={stopSimulation}>
                <Pause size={20} />
                Stop
              </button>
            ) : (
              <button className="control-btn start" onClick={startSimulation}>
                <Play size={20} />
                Start
              </button>
            )}
            <button className="control-btn reset" onClick={resetStats} disabled={isRunning}>
              <RefreshCw size={20} />
              Reset
            </button>
          </div>
        </header>

        {/* Stats Dashboard */}
        <section className="stats-dashboard">
          <div className="stat-card primary">
            <Users size={24} />
            <div className="stat-content">
              <span className="stat-value">{stats.totalVisitors}</span>
              <span className="stat-label">Total Visitors</span>
            </div>
            <div className="stat-badge">
              {stats.activeVisitors} active
            </div>
          </div>
          
          <div className="stat-card">
            <Eye size={24} />
            <div className="stat-content">
              <span className="stat-value">{stats.totalPageViews}</span>
              <span className="stat-label">Page Views</span>
            </div>
          </div>
          
          <div className="stat-card">
            <ShoppingCart size={24} />
            <div className="stat-content">
              <span className="stat-value">{stats.totalAddToCarts}</span>
              <span className="stat-label">Add to Carts</span>
            </div>
          </div>
          
          <div className="stat-card">
            <CreditCard size={24} />
            <div className="stat-content">
              <span className="stat-value">{stats.totalPurchases}</span>
              <span className="stat-label">Purchases</span>
            </div>
          </div>
          
          <div className="stat-card highlight">
            <TrendingUp size={24} />
            <div className="stat-content">
              <span className="stat-value">{conversionRate}%</span>
              <span className="stat-label">Conversion Rate</span>
            </div>
          </div>
          
          <div className="stat-card revenue">
            <span className="currency">$</span>
            <div className="stat-content">
              <span className="stat-value">{stats.totalRevenue.toFixed(2)}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <div className="stat-sublabel">
              AOV: ${avgOrderValue}
            </div>
          </div>
        </section>

        <div className="simulator-grid">
          {/* Configuration Panel */}
          <section className="config-panel">
            <h2><Settings size={20} /> Configuration</h2>
            
            <div className="config-group">
              <label>
                Visitors per minute
                <input 
                  type="number" 
                  min="1" 
                  max="100"
                  value={config.visitorsPerMinute}
                  onChange={e => setConfig(prev => ({ ...prev, visitorsPerMinute: Number(e.target.value) }))}
                  disabled={isRunning}
                />
              </label>
              
              <label>
                Step delay (ms)
                <input 
                  type="number" 
                  min="100" 
                  max="5000"
                  step="100"
                  value={config.stepDelay}
                  onChange={e => setConfig(prev => ({ ...prev, stepDelay: Number(e.target.value) }))}
                  disabled={isRunning}
                />
              </label>
            </div>

            <h3>Journey Type Ratios</h3>
            <div className="journey-ratios">
              {Object.entries(JOURNEY_TYPES).map(([key, journey]) => {
                const Icon = journey.icon;
                const ratioKey = `${key.toLowerCase().replace(/_/g, '')}Ratio`;
                const configKey = key === 'BROWSER' ? 'browserRatio' :
                                  key === 'CART_ABANDONER' ? 'abandonerRatio' :
                                  key === 'HESITANT_BUYER' ? 'hesitantRatio' :
                                  key === 'QUICK_BUYER' ? 'quickBuyerRatio' : 'powerShopperRatio';
                
                return (
                  <div key={key} className="ratio-item" style={{ '--journey-color': journey.color }}>
                    <div className="ratio-header">
                      <Icon size={16} style={{ color: journey.color }} />
                      <span>{journey.name}</span>
                    </div>
                    <p className="ratio-desc">{journey.description}</p>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={config[configKey]}
                      onChange={e => setConfig(prev => ({ ...prev, [configKey]: Number(e.target.value) }))}
                      disabled={isRunning}
                    />
                    <span className="ratio-value">{config[configKey]}%</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Active Journeys */}
          <section className="active-journeys">
            <h2><Users size={20} /> Active Journeys ({activeJourneys.length})</h2>
            <div className="journeys-list">
              {activeJourneys.length === 0 ? (
                <p className="empty-state">No active journeys. Start the simulation!</p>
              ) : (
                activeJourneys.map(journey => {
                  const JourneyIcon = JOURNEY_TYPES[journey.type]?.icon || Users;
                  return (
                    <div key={journey.id} className="journey-item" style={{ '--journey-color': journey.color }}>
                      <JourneyIcon size={16} style={{ color: journey.color }} />
                      <span className="journey-type">{journey.typeName}</span>
                      <div className="journey-progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${(journey.currentStep / journey.totalSteps) * 100}%` }}
                        />
                      </div>
                      <span className="journey-step">{journey.currentStep}/{journey.totalSteps}</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Activity Log */}
          <section className="activity-log">
            <h2>📋 Activity Log</h2>
            <div className="log-list">
              {logs.length === 0 ? (
                <p className="empty-state">No activity yet</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={`log-entry ${log.type}`}>
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Journey Breakdown */}
        {Object.keys(stats.journeyBreakdown).length > 0 && (
          <section className="journey-breakdown">
            <h2>Journey Breakdown</h2>
            <div className="breakdown-grid">
              {Object.entries(stats.journeyBreakdown).map(([type, count]) => {
                const journey = JOURNEY_TYPES[type];
                const Icon = journey?.icon || Users;
                const percentage = ((count / stats.totalVisitors) * 100).toFixed(1);
                
                return (
                  <div key={type} className="breakdown-item" style={{ '--journey-color': journey?.color }}>
                    <Icon size={24} style={{ color: journey?.color }} />
                    <span className="breakdown-name">{journey?.name || type}</span>
                    <span className="breakdown-count">{count}</span>
                    <span className="breakdown-pct">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default TrafficSimulator;
