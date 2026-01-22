import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import convertService from './convertService.js';
import products, { getRecommendations, getProductById } from './products.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Convert SDK
await convertService.initialize({
  sdkKey: process.env.CONVERT_SDK_KEY,
  sdkKeySecret: process.env.CONVERT_SDK_KEY_SECRET,
  environment: process.env.CONVERT_ENVIRONMENT || 'staging'
});

// ============================================
// API ROUTES
// ============================================

// Health check & SDK status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    sdk: convertService.getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Generate or validate visitor ID
app.post('/api/visitor', (req, res) => {
  const { visitorId } = req.body;
  const id = visitorId || uuidv4();
  
  res.json({
    visitorId: id,
    isNew: !visitorId
  });
});

// ============================================
// CONVERT SDK ENDPOINTS
// ============================================

// Run all experiences for a location
app.post('/api/experiences/run', async (req, res) => {
  try {
    const { visitorId, location, visitorProperties = {} } = req.body;
    
    if (!visitorId || !location) {
      return res.status(400).json({ error: 'visitorId and location are required' });
    }

    const results = await convertService.runExperiences(
      visitorId,
      { location },
      visitorProperties
    );

    res.json({
      visitorId,
      location,
      experiences: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running experiences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Run a specific experience
app.post('/api/experiences/:experienceKey/run', async (req, res) => {
  try {
    const { experienceKey } = req.params;
    const { visitorId, location, visitorProperties = {} } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const result = await convertService.runExperience(
      visitorId,
      experienceKey,
      { location },
      visitorProperties
    );

    res.json({
      visitorId,
      experienceKey,
      variation: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running experience:', error);
    res.status(500).json({ error: error.message });
  }
});

// Run all features for a location
app.post('/api/features/run', async (req, res) => {
  try {
    const { visitorId, location, visitorProperties = {} } = req.body;
    
    if (!visitorId || !location) {
      return res.status(400).json({ error: 'visitorId and location are required' });
    }

    const features = await convertService.runFeatures(
      visitorId,
      { location },
      visitorProperties
    );

    res.json({
      visitorId,
      location,
      features,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running features:', error);
    res.status(500).json({ error: error.message });
  }
});

// Run a specific feature
app.post('/api/features/:featureKey/run', async (req, res) => {
  try {
    const { featureKey } = req.params;
    const { visitorId, location, visitorProperties = {} } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const feature = await convertService.runFeature(
      visitorId,
      featureKey,
      { location },
      visitorProperties
    );

    res.json({
      visitorId,
      featureKey,
      feature,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running feature:', error);
    res.status(500).json({ error: error.message });
  }
});

// Track conversion event
app.post('/api/track', async (req, res) => {
  try {
    const { visitorId, goalKey, ruleData = {}, conversionData = [] } = req.body;
    
    if (!visitorId || !goalKey) {
      return res.status(400).json({ error: 'visitorId and goalKey are required' });
    }

    const result = await convertService.trackConversion(visitorId, goalKey, {
      ruleData,
      conversionData
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PRODUCT ENDPOINTS
// ============================================

// Get all products
app.get('/api/products', (req, res) => {
  const { category, limit } = req.query;
  
  let result = products;
  
  if (category) {
    result = result.filter(p => p.category === category);
  }
  
  if (limit) {
    result = result.slice(0, parseInt(limit));
  }
  
  res.json({ products: result });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = getProductById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ product });
});

// Get product recommendations
app.get('/api/recommendations', (req, res) => {
  const { algorithm = 'popular', count = 4, exclude = '' } = req.query;
  const excludeIds = exclude ? exclude.split(',') : [];
  
  const recommendations = getRecommendations(algorithm, parseInt(count), excludeIds);
  
  res.json({
    algorithm,
    recommendations
  });
});

// ============================================
// COMBINED ENDPOINTS (Product + Features)
// ============================================

// Get homepage data with features
app.post('/api/pages/homepage', async (req, res) => {
  try {
    const { visitorId, visitorProperties = {} } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    // Run features for homepage location
    const features = await convertService.runFeatures(
      visitorId,
      { location: 'homepage' },
      visitorProperties
    );

    // Get featured products
    const featuredProducts = products.slice(0, 8);

    // Parse special deals feature if enabled
    const specialDeals = features.find(f => f.key === 'special-deals');
    
    res.json({
      visitorId,
      features,
      specialDeals: specialDeals ? {
        enabled: specialDeals.status === 'enabled',
        bannerText: specialDeals.variables?.banner_text,
        deals: specialDeals.variables?.deals || []
      } : { enabled: false },
      featuredProducts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get products page data with features
app.post('/api/pages/products', async (req, res) => {
  try {
    const { visitorId, visitorProperties = {}, category } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    // Run features for products location
    const features = await convertService.runFeatures(
      visitorId,
      { location: 'products' },
      visitorProperties
    );

    // Get products
    let productList = category 
      ? products.filter(p => p.category === category)
      : products;

    // Parse features
    const quickBuy = features.find(f => f.key === 'quick-buy');
    const recommendations = features.find(f => f.key === 'product-recommendations');

    // Get recommendations based on feature
    const recAlgorithm = recommendations?.variables?.algorithm || 'popular';
    const recCount = recommendations?.variables?.count || 4;
    const recommendedProducts = getRecommendations(recAlgorithm, recCount);

    res.json({
      visitorId,
      features,
      products: productList,
      quickBuy: quickBuy ? {
        enabled: quickBuy.variables?.enabled || false,
        buttonText: quickBuy.variables?.button_text || 'Quick Buy'
      } : { enabled: false },
      recommendations: {
        algorithm: recAlgorithm,
        products: recommendedProducts
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading products page:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get cart page data with features
app.post('/api/pages/cart', async (req, res) => {
  try {
    const { visitorId, visitorProperties = {}, cartItems = [] } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    // Run features for cart location
    const features = await convertService.runFeatures(
      visitorId,
      { location: 'cart' },
      visitorProperties
    );

    // Calculate cart totals
    const cartProducts = cartItems.map(item => {
      const product = getProductById(item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    }).filter(Boolean);

    const subtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Parse discount feature
    const discount = features.find(f => f.key === 'discount-banner');
    const discountPercent = discount?.variables?.discount_percent || 0;
    const minimumOrder = discount?.variables?.minimum_order || 0;
    const promoCode = discount?.variables?.promo_code || '';
    
    const discountApplied = discountPercent > 0 && subtotal >= minimumOrder;
    const discountAmount = discountApplied ? (subtotal * discountPercent / 100) : 0;
    const total = subtotal - discountAmount;

    res.json({
      visitorId,
      features,
      cart: {
        items: cartProducts,
        subtotal: Math.round(subtotal * 100) / 100,
        discountApplied,
        discountPercent: discountApplied ? discountPercent : 0,
        discountAmount: Math.round(discountAmount * 100) / 100,
        promoCode: discountApplied ? promoCode : null,
        minimumOrder,
        total: Math.round(total * 100) / 100
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading cart page:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🛒  Convert E-commerce Demo Backend                          ║
║                                                                ║
║   Server running at: http://localhost:${PORT}                    ║
║   SDK Mode: ${convertService.getStatus().mode.toUpperCase().padEnd(48)}║
║                                                                ║
║   Endpoints:                                                   ║
║   • GET  /api/status           - Health check & SDK status     ║
║   • POST /api/visitor          - Get/create visitor ID         ║
║   • POST /api/experiences/run  - Run experiences               ║
║   • POST /api/features/run     - Run features                  ║
║   • POST /api/track            - Track conversions             ║
║   • GET  /api/products         - Get products                  ║
║   • POST /api/pages/homepage   - Homepage with features        ║
║   • POST /api/pages/products   - Products with features        ║
║   • POST /api/pages/cart       - Cart with features            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

export default app;
