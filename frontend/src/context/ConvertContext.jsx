import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const ConvertContext = createContext(null);

// Storage key for visitor ID
const VISITOR_ID_KEY = 'convert_visitor_id';

export function ConvertProvider({ children }) {
  const [visitorId, setVisitorId] = useState(null);
  const [sdkStatus, setSdkStatus] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [features, setFeatures] = useState({});
  const [experiences, setExperiences] = useState({});

  // Initialize visitor on mount
  useEffect(() => {
    async function init() {
      try {
        // Check for existing visitor ID in localStorage
        const existingId = localStorage.getItem(VISITOR_ID_KEY);
        
        // Create or validate visitor
        const { visitorId: id, isNew } = await api.createVisitor(existingId);
        
        // Store visitor ID
        localStorage.setItem(VISITOR_ID_KEY, id);
        setVisitorId(id);

        // Get SDK status
        const status = await api.getStatus();
        setSdkStatus(status.sdk);

        setIsReady(true);
        
        console.log(`🎯 Convert initialized | Visitor: ${id} | Mode: ${status.sdk.mode} | New: ${isNew}`);
      } catch (error) {
        console.error('Failed to initialize Convert:', error);
        // Still set ready so app doesn't hang
        setIsReady(true);
      }
    }

    init();
  }, []);

  // Run features for a location
  const runFeatures = useCallback(async (location, visitorProperties = {}) => {
    if (!visitorId) return [];

    try {
      const result = await api.runFeatures(visitorId, location, visitorProperties);
      
      // Cache features by location
      setFeatures(prev => ({
        ...prev,
        [location]: result.features
      }));

      return result.features;
    } catch (error) {
      console.error(`Failed to run features for location: ${location}`, error);
      return [];
    }
  }, [visitorId]);

  // Run specific feature
  const runFeature = useCallback(async (featureKey, location, visitorProperties = {}) => {
    if (!visitorId) return null;

    try {
      const result = await api.runFeature(visitorId, featureKey, location, visitorProperties);
      return result.feature;
    } catch (error) {
      console.error(`Failed to run feature: ${featureKey}`, error);
      return null;
    }
  }, [visitorId]);

  // Run experiences for a location
  const runExperiences = useCallback(async (location, visitorProperties = {}) => {
    if (!visitorId) return [];

    try {
      const result = await api.runExperiences(visitorId, location, visitorProperties);
      
      // Cache experiences by location
      setExperiences(prev => ({
        ...prev,
        [location]: result.experiences
      }));

      return result.experiences;
    } catch (error) {
      console.error(`Failed to run experiences for location: ${location}`, error);
      return [];
    }
  }, [visitorId]);

  // Track conversion
  const trackConversion = useCallback(async (goalKey, ruleData = {}, conversionData = []) => {
    if (!visitorId) return null;

    try {
      const result = await api.trackConversion(visitorId, goalKey, ruleData, conversionData);
      console.log(`📊 Tracked: ${goalKey}`, result);
      return result;
    } catch (error) {
      console.error(`Failed to track conversion: ${goalKey}`, error);
      return null;
    }
  }, [visitorId]);

  // Track product view
  const trackProductView = useCallback((productId) => {
    return trackConversion('product-view', { action: 'view_product' });
  }, [trackConversion]);

  // Track add to cart
  const trackAddToCart = useCallback((productId, price, quantity = 1) => {
    return trackConversion('add-to-cart', { action: 'add_to_cart' });
  }, [trackConversion]);

  // Track purchase
  const trackPurchase = useCallback((amount, productsCount, transactionId) => {
    return trackConversion(
      'purchase',
      { action: 'purchase' },
      [
        { key: 'amount', value: amount },
        { key: 'productsCount', value: productsCount },
        { key: 'transactionId', value: transactionId }
      ]
    );
  }, [trackConversion]);

  // Reset visitor (for testing)
  const resetVisitor = useCallback(async () => {
    localStorage.removeItem(VISITOR_ID_KEY);
    const { visitorId: newId } = await api.createVisitor();
    localStorage.setItem(VISITOR_ID_KEY, newId);
    setVisitorId(newId);
    setFeatures({});
    setExperiences({});
    console.log(`🔄 Visitor reset: ${newId}`);
    return newId;
  }, []);

  const value = {
    // State
    visitorId,
    sdkStatus,
    isReady,
    features,
    experiences,
    
    // Methods
    runFeatures,
    runFeature,
    runExperiences,
    trackConversion,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    resetVisitor
  };

  return (
    <ConvertContext.Provider value={value}>
      {children}
    </ConvertContext.Provider>
  );
}

export function useConvert() {
  const context = useContext(ConvertContext);
  if (!context) {
    throw new Error('useConvert must be used within a ConvertProvider');
  }
  return context;
}

export default ConvertContext;
