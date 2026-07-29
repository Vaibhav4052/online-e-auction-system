import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.logo}>⚡ BlockAuction</Link>
      <div style={S.links}>
        <Link to="/" style={S.link}>Auctions</Link>
        {user?.role === 'SELLER' && <Link to="/create" style={S.link}>+ Create</Link>}
        {user?.role === 'SELLER' && <Link to="/my-auctions" style={S.link}>My Auctions</Link>}
        {user && <Link to="/my-bids" style={S.link}>My Bids</Link>}
        <Link to="/verify" style={S.link}>🔗 Verify</Link>
        {user ? (
          <div style={S.userArea}>
            <span style={S.badge}>{user.role}</span>
            <span style={S.name}>{user.name}</span>
            <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" style={S.link}>Login</Link>
            <Link to="/register" style={S.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const S = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 32px', background:'#0f172a', borderBottom:'1px solid #1e293b', position:'sticky', top:0, zIndex:100 },
  logo: { color:'#f59e0b', fontWeight:800, fontSize:20, textDecoration:'none' },
  links: { display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' },
  link: { color:'#94a3b8', textDecoration:'none', fontSize:14, fontWeight:500 },
  userArea: { display:'flex', alignItems:'center', gap:10 },
  badge: { background:'#1e3a5f', color:'#60a5fa', padding:'2px 10px', borderRadius:12, fontSize:11, fontWeight:700 },
  name: { color:'#e2e8f0', fontSize:13 },
  logoutBtn: { background:'#ef4444', color:'#fff', border:'none', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:13 },
  registerBtn: { background:'#f59e0b', color:'#0f172a', padding:'6px 16px', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:13 }
};
