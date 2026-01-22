// Mock Convert project configuration for demo/development
// This simulates what the SDK would fetch from Convert's CDN
// Replace with real SDK key in production

export const mockProjectConfig = {
  account_id: "demo_account",
  project: {
    id: "demo_project",
    key: "ecommerce-demo",
    name: "E-commerce Demo Project",
    settings: {
      data_store: "cookie"
    }
  },
  environments: [
    { id: "env_1", key: "staging", name: "Staging" },
    { id: "env_2", key: "production", name: "Production" }
  ],
  locations: [
    {
      id: "loc_1",
      key: "homepage",
      name: "Homepage",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "location",
                value: "homepage"
              }
            ]
          }
        ]
      }
    },
    {
      id: "loc_2",
      key: "product-listing",
      name: "Product Listing",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "location",
                value: "products"
              }
            ]
          }
        ]
      }
    },
    {
      id: "loc_3",
      key: "cart-page",
      name: "Cart Page",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "location",
                value: "cart"
              }
            ]
          }
        ]
      }
    }
  ],
  audiences: [
    {
      id: "aud_1",
      key: "new-visitors",
      name: "New Visitors",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "visitorType",
                value: "new"
              }
            ]
          }
        ]
      }
    },
    {
      id: "aud_2",
      key: "returning-customers",
      name: "Returning Customers",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "visitorType",
                value: "returning"
              }
            ]
          }
        ]
      }
    }
  ],
  segments: [
    {
      id: "seg_1",
      key: "high-value",
      name: "High Value Customers",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_numeric_key_value",
                matching: { match_type: "less", negated: true },
                key: "totalPurchases",
                value: 500
              }
            ]
          }
        ]
      }
    }
  ],
  features: [
    {
      id: "feat_1",
      key: "special-deals",
      name: "Special Deals Banner",
      variables: [
        {
          key: "deals",
          type: "json",
          default_value: "[]"
        },
        {
          key: "banner_text",
          type: "string",
          default_value: "Check out our deals!"
        }
      ]
    },
    {
      id: "feat_2",
      key: "quick-buy",
      name: "Quick Buy Button",
      variables: [
        {
          key: "enabled",
          type: "boolean",
          default_value: "false"
        },
        {
          key: "button_text",
          type: "string",
          default_value: "Quick Buy"
        }
      ]
    },
    {
      id: "feat_3",
      key: "product-recommendations",
      name: "Product Recommendations",
      variables: [
        {
          key: "algorithm",
          type: "string",
          default_value: "popular"
        },
        {
          key: "count",
          type: "integer",
          default_value: "4"
        }
      ]
    },
    {
      id: "feat_4",
      key: "discount-banner",
      name: "Cart Discount Banner",
      variables: [
        {
          key: "discount_percent",
          type: "integer",
          default_value: "0"
        },
        {
          key: "minimum_order",
          type: "integer",
          default_value: "50"
        },
        {
          key: "promo_code",
          type: "string",
          default_value: ""
        }
      ]
    }
  ],
  goals: [
    {
      id: "goal_1",
      key: "product-view",
      name: "Product View",
      type: "event",
      triggering: "manual",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "action",
                value: "view_product"
              }
            ]
          }
        ]
      }
    },
    {
      id: "goal_2",
      key: "add-to-cart",
      name: "Add to Cart",
      type: "event",
      triggering: "manual",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "action",
                value: "add_to_cart"
              }
            ]
          }
        ]
      }
    },
    {
      id: "goal_3",
      key: "purchase",
      name: "Purchase",
      type: "revenue",
      triggering: "manual",
      rules: {
        OR: [
          {
            AND: [
              {
                rule_type: "generic_text_key_value",
                matching: { match_type: "matches", negated: false },
                key: "action",
                value: "purchase"
              }
            ]
          }
        ]
      }
    }
  ],
  experiences: [
    {
      id: "exp_1",
      key: "homepage-deals",
      name: "Homepage Special Deals Test",
      type: "a/b_fullstack",
      status: "active",
      environments: ["staging", "production"],
      locations: ["loc_1"],
      audiences: [],
      goals: ["goal_1", "goal_2", "goal_3"],
      variations: [
        {
          id: "var_1_0",
          key: "original",
          name: "Original",
          traffic_allocation: 3000,
          changes: []
        },
        {
          id: "var_1_1",
          key: "flash-sale",
          name: "Flash Sale Banner",
          traffic_allocation: 3500,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_1",
                variables_data: {
                  deals: JSON.stringify([
                    { id: "deal1", name: "Wireless Headphones", originalPrice: 149, salePrice: 99, badge: "30% OFF" },
                    { id: "deal2", name: "Smart Watch", originalPrice: 299, salePrice: 199, badge: "HOT DEAL" },
                    { id: "deal3", name: "Bluetooth Speaker", originalPrice: 79, salePrice: 49, badge: "FLASH SALE" }
                  ]),
                  banner_text: "⚡ Flash Sale - Limited Time Only!"
                }
              }
            }
          ]
        },
        {
          id: "var_1_2",
          key: "seasonal-deals",
          name: "Seasonal Deals",
          traffic_allocation: 3500,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_1",
                variables_data: {
                  deals: JSON.stringify([
                    { id: "deal1", name: "Winter Jacket", originalPrice: 199, salePrice: 129, badge: "WINTER SALE" },
                    { id: "deal2", name: "Cozy Blanket Set", originalPrice: 89, salePrice: 59, badge: "BESTSELLER" },
                    { id: "deal3", name: "Thermal Mug", originalPrice: 35, salePrice: 22, badge: "TRENDING" }
                  ]),
                  banner_text: "❄️ Winter Warmth Sale - Stay Cozy!"
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "exp_2",
      key: "quick-buy-test",
      name: "Quick Buy Button Test",
      type: "a/b_fullstack",
      status: "active",
      environments: ["staging", "production"],
      locations: ["loc_2"],
      audiences: [],
      goals: ["goal_2", "goal_3"],
      variations: [
        {
          id: "var_2_0",
          key: "original",
          name: "Original - No Quick Buy",
          traffic_allocation: 5000,
          changes: []
        },
        {
          id: "var_2_1",
          key: "with-quick-buy",
          name: "With Quick Buy Button",
          traffic_allocation: 5000,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_2",
                variables_data: {
                  enabled: true,
                  button_text: "⚡ Quick Buy"
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "exp_3",
      key: "recommendation-algorithm",
      name: "Recommendation Algorithm Test",
      type: "a/b_fullstack",
      status: "active",
      environments: ["staging", "production"],
      locations: ["loc_2"],
      audiences: [],
      goals: ["goal_1", "goal_2"],
      variations: [
        {
          id: "var_3_0",
          key: "popular",
          name: "Popular Items",
          traffic_allocation: 3333,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_3",
                variables_data: {
                  algorithm: "popular",
                  count: 4
                }
              }
            }
          ]
        },
        {
          id: "var_3_1",
          key: "personalized",
          name: "Personalized Recommendations",
          traffic_allocation: 3333,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_3",
                variables_data: {
                  algorithm: "personalized",
                  count: 6
                }
              }
            }
          ]
        },
        {
          id: "var_3_2",
          key: "trending",
          name: "Trending Now",
          traffic_allocation: 3334,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_3",
                variables_data: {
                  algorithm: "trending",
                  count: 4
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "exp_4",
      key: "cart-discount-test",
      name: "Cart Discount Banner Test",
      type: "a/b_fullstack",
      status: "active",
      environments: ["staging", "production"],
      locations: ["loc_3"],
      audiences: [],
      goals: ["goal_3"],
      variations: [
        {
          id: "var_4_0",
          key: "no-discount",
          name: "No Discount Banner",
          traffic_allocation: 5000,
          changes: []
        },
        {
          id: "var_4_1",
          key: "with-discount",
          name: "10% Discount Banner",
          traffic_allocation: 5000,
          changes: [
            {
              type: "fullStackFeature",
              data: {
                feature_id: "feat_4",
                variables_data: {
                  discount_percent: 10,
                  minimum_order: 75,
                  promo_code: "SAVE10"
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

export default mockProjectConfig;
