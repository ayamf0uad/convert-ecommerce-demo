import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import TrafficSimulator from './pages/TrafficSimulator';
import DebugPanel from './components/DebugPanel';
import CartDrawer from './components/CartDrawer';
import { useConvert } from './context/ConvertContext';
import './App.css';

function App() {
  const { isReady } = useConvert();

  if (!isReady) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/simulator" element={<TrafficSimulator />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <DebugPanel />
    </div>
  );
}

export default App;