import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/CreateAuction';
import MyBids from './pages/MyBids';
import MyAuctions from './pages/MyAuctions';
import VerifyBlockchain from './pages/VerifyBlockchain';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div style={{ minHeight:'100vh', background:'#0f172a' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/create" element={<CreateAuction />} />
            <Route path="/my-bids" element={<MyBids />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/verify" element={<VerifyBlockchain />} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ style:{ background:'#1e293b', color:'#f1f5f9', border:'1px solid #334155' } }} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}
