const API_BASE = '/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Status
  getStatus() {
    return this.request('/status');
  }

  // Visitor
  createVisitor(visitorId = null) {
    return this.request('/visitor', {
      method: 'POST',
      body: { visitorId }
    });
  }

  // Experiences
  runExperiences(visitorId, location, visitorProperties = {}) {
    return this.request('/experiences/run', {
      method: 'POST',
      body: { visitorId, location, visitorProperties }
    });
  }

  runExperience(visitorId, experienceKey, location, visitorProperties = {}) {
    return this.request(`/experiences/${experienceKey}/run`, {
      method: 'POST',
      body: { visitorId, location, visitorProperties }
    });
  }

  // Features
  runFeatures(visitorId, location, visitorProperties = {}) {
    return this.request('/features/run', {
      method: 'POST',
      body: { visitorId, location, visitorProperties }
    });
  }

  runFeature(visitorId, featureKey, location, visitorProperties = {}) {
    return this.request(`/features/${featureKey}/run`, {
      method: 'POST',
      body: { visitorId, location, visitorProperties }
    });
  }

  // Tracking
  trackConversion(visitorId, goalKey, ruleData = {}, conversionData = []) {
    return this.request('/track', {
      method: 'POST',
      body: { visitorId, goalKey, ruleData, conversionData }
    });
  }

  // Products
  getProducts(category = null, limit = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit);
    const query = params.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  getProduct(id) {
    return this.request(`/products/${id}`);
  }

  getRecommendations(algorithm = 'popular', count = 4, exclude = []) {
    const params = new URLSearchParams({
      algorithm,
      count: count.toString(),
      exclude: exclude.join(',')
    });
    return this.request(`/recommendations?${params}`);
  }

  // Page endpoints (combined data + features)
  getHomepage(visitorId, visitorProperties = {}) {
    return this.request('/pages/homepage', {
      method: 'POST',
      body: { visitorId, visitorProperties }
    });
  }

  getProductsPage(visitorId, visitorProperties = {}, category = null) {
    return this.request('/pages/products', {
      method: 'POST',
      body: { visitorId, visitorProperties, category }
    });
  }

  getCartPage(visitorId, cartItems = [], visitorProperties = {}) {
    return this.request('/pages/cart', {
      method: 'POST',
      body: { visitorId, visitorProperties, cartItems }
    });
  }

  getProductPage(visitorId, productId, visitorProperties = {}) {
    return this.request('/pages/product', {
      method: 'POST',
      body: { visitorId, visitorProperties, productId }
    });
  }
}

export const api = new ApiClient();
export default api;
