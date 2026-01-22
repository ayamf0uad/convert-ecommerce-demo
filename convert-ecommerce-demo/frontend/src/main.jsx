import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConvertProvider } from './context/ConvertContext';
import { CartProvider } from './context/CartContext';
import './styles/index.css';

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
