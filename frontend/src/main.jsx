import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConvertProvider } from './context/ConvertContext';
import { CartProvider } from './context/CartContext';
import './styles/index.css';

// BUG 5: calling an undefined function on every page load regardless of variant.
// Throws: "ReferenceError: initAnalyticsSuite is not defined"
// This is intentionally unconditional — a JS error in main.jsx cannot be
// gated by a Convert variant (variants aren't known until after the app mounts).
// It simulates a developer mistake that affects all visitors globally.
initAnalyticsSuite({ tracking: true, env: 'production' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConvertProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ConvertProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// BUG 5: JS console error — fires after app mounts so UI still loads normally.
// Throws: "ReferenceError: initAnalyticsSuite is not defined"
// Intentionally unconditional — simulates a developer mistake visible to all visitors.
// A QA agent checking console errors should catch this immediately.
setTimeout(() => {
  initAnalyticsSuite({ tracking: true, env: 'production' });
}, 0);
