import { mockProjectConfig } from './mockConfig.js';

// This is a wrapper around the Convert SDK that handles both
// real SDK usage (with actual SDK key) and demo mode (with mock config)

class ConvertService {
  constructor() {
    this.sdk = null;
    this.isReady = false;
    this.useMockMode = true;
    this.userContexts = new Map(); // Store user contexts
  }

  async initialize(config = {}) {
    const { sdkKey, sdkKeySecret, environment = 'staging' } = config;

    // Check if we have real SDK credentials
    if (sdkKey && sdkKey !== 'your_sdk_key_here') {
      try {
        // Dynamic import for the real SDK
        const ConvertSDKModule = await import('@convertcom/js-sdk');
        const ConvertSDK = ConvertSDKModule.default || ConvertSDKModule;
        
        this.sdk = new ConvertSDK({
          sdkKey,
          sdkKeySecret,
          environment,
          dataRefreshInterval: 300000, // 5 minutes
          network: {
            tracking: true
          }
        });

        await this.sdk.onReady();
        this.useMockMode = false;
        this.isReady = true;
        console.log('✅ Convert SDK initialized with real credentials');
        return true;
      } catch (error) {
        console.error('Failed to initialize real SDK, falling back to mock mode:', error.message);
      }
    }

    // Use mock mode
    this.useMockMode = true;
    this.isReady = true;
    console.log('🧪 Convert SDK running in DEMO mode with mock configuration');
    return true;
  }

  // Create or retrieve user context
  getOrCreateContext(userId, visitorProperties = {}) {
    if (!this.isReady) {
      throw new Error('Convert SDK not initialized');
    }

    if (this.useMockMode) {
      // Return mock context
      return new MockUserContext(userId, visitorProperties, mockProjectConfig);
    }

    // Real SDK context
    if (!this.userContexts.has(userId)) {
      const context = this.sdk.createContext(userId, visitorProperties);
      this.userContexts.set(userId, context);
    }
    return this.userContexts.get(userId);
  }

  // Run experiences for a location
  async runExperiences(userId, locationProperties, visitorProperties = {}) {
    const context = this.getOrCreateContext(userId, visitorProperties);
    
    if (this.useMockMode) {
      return context.runExperiences({ locationProperties, visitorProperties });
    }

    return context.runExperiences({ locationProperties, visitorProperties });
  }

  // Run specific experience
  async runExperience(userId, experienceKey, locationProperties, visitorProperties = {}) {
    const context = this.getOrCreateContext(userId, visitorProperties);
    
    if (this.useMockMode) {
      return context.runExperience(experienceKey, { locationProperties, visitorProperties });
    }

    return context.runExperience(experienceKey, { locationProperties, visitorProperties });
  }

  // Run features
  async runFeatures(userId, locationProperties, visitorProperties = {}) {
    const context = this.getOrCreateContext(userId, visitorProperties);
    
    if (this.useMockMode) {
      return context.runFeatures({ locationProperties, visitorProperties });
    }

    return context.runFeatures({ locationProperties, visitorProperties });
  }

  // Run single feature
  async runFeature(userId, featureKey, locationProperties, visitorProperties = {}) {
    const context = this.getOrCreateContext(userId, visitorProperties);
    
    if (this.useMockMode) {
      return context.runFeature(featureKey, { locationProperties, visitorProperties });
    }

    return context.runFeature(featureKey, { locationProperties, visitorProperties });
  }

  // Track conversion
  async trackConversion(userId, goalKey, conversionData = {}) {
    const context = this.getOrCreateContext(userId);
    
    if (this.useMockMode) {
      return context.trackConversion(goalKey, conversionData);
    }

    return context.trackConversion(goalKey, conversionData);
  }

  // Get SDK status
  getStatus() {
    return {
      isReady: this.isReady,
      mode: this.useMockMode ? 'demo' : 'live',
      activeUsers: this.userContexts.size
    };
  }
}

// Mock User Context for demo mode
class MockUserContext {
  constructor(userId, visitorProperties, config) {
    this.userId = userId;
    this.visitorProperties = visitorProperties;
    this.config = config;
    // Use consistent bucketing based on userId hash
    this.bucketingHash = this.hashCode(userId);
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Determine which variation to bucket user into
  bucketVariation(experience) {
    const variations = experience.variations;
    const totalTraffic = variations.reduce((sum, v) => sum + v.traffic_allocation, 0);
    const bucket = this.bucketingHash % totalTraffic;
    
    let cumulative = 0;
    for (const variation of variations) {
      cumulative += variation.traffic_allocation;
      if (bucket < cumulative) {
        return variation;
      }
    }
    return variations[0];
  }

  // Check if location matches
  matchesLocation(experience, locationProperties) {
    const locationIds = experience.locations;
    const locations = this.config.locations.filter(l => locationIds.includes(l.id));
    
    for (const location of locations) {
      if (this.evaluateRules(location.rules, locationProperties)) {
        return true;
      }
    }
    return false;
  }

  evaluateRules(rules, properties) {
    if (!rules || !rules.OR) return true;
    
    for (const orGroup of rules.OR) {
      if (!orGroup.AND) continue;
      
      let andMatch = true;
      for (const rule of orGroup.AND) {
        const propValue = properties[rule.key];
        const ruleValue = rule.value;
        
        switch (rule.matching.match_type) {
          case 'matches':
            andMatch = andMatch && (propValue === ruleValue);
            break;
          case 'contains':
            andMatch = andMatch && (propValue && propValue.includes(ruleValue));
            break;
          default:
            andMatch = andMatch && (propValue === ruleValue);
        }
        
        if (rule.matching.negated) {
          andMatch = !andMatch;
        }
      }
      
      if (andMatch) return true;
    }
    return false;
  }

  runExperiences(attributes = {}) {
    const { locationProperties = {}, visitorProperties = {} } = attributes;
    const results = [];

    for (const experience of this.config.experiences) {
      if (experience.status !== 'active') continue;
      if (!this.matchesLocation(experience, locationProperties)) continue;

      const variation = this.bucketVariation(experience);
      results.push({
        experienceId: experience.id,
        experienceKey: experience.key,
        experienceName: experience.name,
        variationId: variation.id,
        variationKey: variation.key,
        variationName: variation.name,
        changes: variation.changes
      });
    }

    return results;
  }

  runExperience(experienceKey, attributes = {}) {
    const { locationProperties = {} } = attributes;
    const experience = this.config.experiences.find(e => e.key === experienceKey);
    
    if (!experience || experience.status !== 'active') return null;
    if (!this.matchesLocation(experience, locationProperties)) return null;

    const variation = this.bucketVariation(experience);
    return {
      experienceId: experience.id,
      experienceKey: experience.key,
      experienceName: experience.name,
      variationId: variation.id,
      variationKey: variation.key,
      variationName: variation.name,
      changes: variation.changes
    };
  }

  runFeatures(attributes = {}) {
    const { locationProperties = {} } = attributes;
    const features = [];

    for (const experience of this.config.experiences) {
      if (experience.status !== 'active') continue;
      if (!this.matchesLocation(experience, locationProperties)) continue;

      const variation = this.bucketVariation(experience);
      
      for (const change of variation.changes) {
        if (change.type === 'fullStackFeature') {
          const featureConfig = this.config.features.find(f => f.id === change.data.feature_id);
          if (featureConfig) {
            const variables = {};
            
            // Apply default values first
            for (const v of featureConfig.variables) {
              try {
                variables[v.key] = v.type === 'json' ? JSON.parse(v.default_value) : v.default_value;
              } catch {
                variables[v.key] = v.default_value;
              }
            }
            
            // Override with variation values
            if (change.data.variables_data) {
              for (const [key, value] of Object.entries(change.data.variables_data)) {
                try {
                  variables[key] = typeof value === 'string' && (value.startsWith('[') || value.startsWith('{')) 
                    ? JSON.parse(value) 
                    : value;
                } catch {
                  variables[key] = value;
                }
              }
            }

            features.push({
              id: featureConfig.id,
              key: featureConfig.key,
              name: featureConfig.name,
              status: 'enabled',
              variables,
              experienceKey: experience.key,
              variationKey: variation.key
            });
          }
        }
      }
    }

    return features;
  }

  runFeature(featureKey, attributes = {}) {
    const features = this.runFeatures(attributes);
    return features.find(f => f.key === featureKey) || null;
  }

  trackConversion(goalKey, conversionData = {}) {
    const goal = this.config.goals.find(g => g.key === goalKey);
    
    console.log(`📊 [MOCK] Tracking conversion for goal: ${goalKey}`, {
      userId: this.userId,
      goalId: goal?.id,
      goalName: goal?.name,
      ...conversionData
    });

    return {
      success: true,
      goalKey,
      goalId: goal?.id,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
const convertService = new ConvertService();
export default convertService;
