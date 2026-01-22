# Convert E-commerce Demo

A fullstack e-commerce demo showcasing **Convert.com's JavaScript SDK** for feature flags, A/B testing, and conversion tracking.

![Demo Screenshot](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop)

## 🎯 What This Demonstrates

This project implements several Convert Fullstack SDK features:

### A/B Tests Running

| Test Name | Location | Variations |
|-----------|----------|------------|
| **Homepage Deals** | `homepage` | Control, Flash Sale Banner, Seasonal Deals |
| **Quick Buy Button** | `products` | Control (hidden), With Quick Buy |
| **Recommendation Algorithm** | `products` | Popular, Personalized, Trending |
| **Cart Discount** | `cart` | Control (no discount), 10% Discount Banner |

### Conversion Goals Tracked

- `product-view` - When a user views a product
- `add-to-cart` - When a user adds an item to cart
- `purchase` - When a user completes checkout (revenue tracking)

## 🏗️ Project Structure

```
convert-ecommerce-demo/
├── backend/
│   ├── server.js           # Express API server
│   ├── convertService.js   # Convert SDK wrapper
│   ├── mockConfig.js       # Demo mode configuration
│   ├── products.js         # Mock product data
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── context/        # React contexts (Convert, Cart)
    │   ├── pages/          # Page components
    │   ├── api.js          # API client
    │   └── App.jsx         # Main app
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Configure environment (optional for real SDK):**

```bash
# In backend directory
cp .env.example .env
# Edit .env with your Convert SDK credentials
```

3. **Start the servers:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

4. **Open http://localhost:5173** in your browser

## 🧪 Demo Mode vs Live Mode

### Demo Mode (Default)
The app runs with a **mock configuration** that simulates the Convert SDK. This lets you:
- See how feature flags work
- Experience A/B test bucketing
- Test conversion tracking
- No Convert account needed!

### Live Mode
To use with real Convert credentials:

1. Create a Fullstack project at [convert.com](https://www.convert.com/)
2. Set up your experiences, features, and goals matching the mock config
3. Add your SDK key to `.env`:

```env
CONVERT_SDK_KEY=your_sdk_key_here
CONVERT_SDK_KEY_SECRET=your_sdk_key_secret_here
CONVERT_ENVIRONMENT=staging
```

## 📚 SDK Integration Patterns

### Server-Side SDK Initialization

```javascript
// convertService.js
import ConvertSDK from '@convertcom/js-sdk';

const convertSDK = new ConvertSDK({
  sdkKey: 'xxx',
  sdkKeySecret: 'xxx',
  environment: 'staging',
  dataRefreshInterval: 300000
});

await convertSDK.onReady();
```

### Creating User Context

```javascript
const context = convertSDK.createContext(userId, {
  country: 'US',
  visitorType: 'new'
});
```

### Running Features

```javascript
const features = context.runFeatures({
  locationProperties: { location: 'homepage' }
});
```

### Tracking Conversions

```javascript
context.trackConversion('purchase', {
  ruleData: { action: 'purchase' },
  conversionData: [
    { key: 'amount', value: 99.99 },
    { key: 'productsCount', value: 2 },
    { key: 'transactionId', value: 'txn_123' }
  ]
});
```

## 🔍 Debug Panel

The app includes a debug panel (bottom-left corner) showing:
- Current SDK mode (demo/live)
- Visitor ID
- Active features and their status
- Active experiences and variations
- Option to reset visitor for new bucketing

## 🎨 Tech Stack

**Backend:**
- Node.js + Express
- @convertcom/js-sdk

**Frontend:**
- React 18
- React Router
- Lucide Icons
- Vite

## 📖 Learn More

- [Convert JavaScript SDK Documentation](https://convertcom.github.io/javascript-sdk/)
- [SDK GitHub Repository](https://github.com/convertcom/javascript-sdk)
- [Convert Fullstack Product](https://www.convert.com/fullstack/)

## 📝 License

MIT - Feel free to use this as a starting point for your own Convert integrations!
