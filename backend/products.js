// Mock product database
export const products = [
  {
    id: "prod_1",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 149.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 2341,
    stock: 45,
    tags: ["popular", "trending"]
  },
  {
    id: "prod_2",
    name: "Smart Fitness Watch",
    description: "Track your health with heart rate monitoring, GPS, and 7-day battery life.",
    price: 299.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 1892,
    stock: 32,
    tags: ["popular", "personalized"]
  },
  {
    id: "prod_3",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with 360° sound and 12-hour playtime.",
    price: 79.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 3102,
    stock: 78,
    tags: ["trending", "popular"]
  },
  {
    id: "prod_4",
    name: "Minimalist Leather Backpack",
    description: "Handcrafted genuine leather backpack with laptop compartment.",
    price: 189.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 856,
    stock: 23,
    tags: ["personalized", "trending"]
  },
  {
    id: "prod_5",
    name: "Ceramic Pour-Over Coffee Set",
    description: "Artisan ceramic dripper with thermal carafe for perfect coffee.",
    price: 64.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 1243,
    stock: 56,
    tags: ["popular", "personalized"]
  },
  {
    id: "prod_6",
    name: "Organic Cotton Throw Blanket",
    description: "Ultra-soft organic cotton blanket, perfect for cozy evenings.",
    price: 89.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 2087,
    stock: 41,
    tags: ["trending", "personalized"]
  },
  {
    id: "prod_7",
    name: "Stainless Steel Water Bottle",
    description: "Double-wall insulated bottle keeps drinks cold for 24 hours.",
    price: 34.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 4521,
    stock: 124,
    tags: ["popular", "trending"]
  },
  {
    id: "prod_8",
    name: "Wireless Charging Pad",
    description: "Fast wireless charger compatible with all Qi-enabled devices.",
    price: 39.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 1678,
    stock: 89,
    tags: ["popular"]
  },
  {
    id: "prod_9",
    name: "Bamboo Desk Organizer",
    description: "Sustainable bamboo organizer with multiple compartments.",
    price: 45.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 923,
    stock: 67,
    tags: ["trending", "personalized"]
  },
  {
    id: "prod_10",
    name: "Merino Wool Beanie",
    description: "Premium merino wool beanie, naturally temperature-regulating.",
    price: 42.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 1456,
    stock: 52,
    tags: ["trending"]
  },
  {
    id: "prod_11",
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with hot-swappable switches.",
    price: 129.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 2934,
    stock: 38,
    tags: ["popular", "personalized"]
  },
  {
    id: "prod_12",
    name: "Scented Soy Candle Set",
    description: "Set of 3 hand-poured soy candles with natural essential oils.",
    price: 54.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 1834,
    stock: 73,
    tags: ["personalized", "trending"]
  }
];

// Get products by algorithm type (for recommendations)
export function getRecommendations(algorithm, count = 4, excludeIds = []) {
  let filtered = products.filter(p => !excludeIds.includes(p.id));
  
  switch (algorithm) {
    case "popular":
      filtered = filtered.filter(p => p.tags.includes("popular"));
      filtered.sort((a, b) => b.reviews - a.reviews);
      break;
    case "trending":
      filtered = filtered.filter(p => p.tags.includes("trending"));
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "personalized":
      filtered = filtered.filter(p => p.tags.includes("personalized"));
      // Shuffle for "personalization" effect
      filtered.sort(() => Math.random() - 0.5);
      break;
    default:
      filtered.sort((a, b) => b.reviews - a.reviews);
  }
  
  return filtered.slice(0, count);
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export default products;
