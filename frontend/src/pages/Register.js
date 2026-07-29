import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'BIDDER', wallet_address:'' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => { e.preventDefault(); dispatch(register(form)); };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.h2}>Create Account</h2>
        <p style={S.sub}>Join BlockAuction today</p>
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Full Name</label>
          <input style={S.input} placeholder="Your Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required />
          <label style={S.label}>I want to</label>
          <select style={S.input} value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
            <option value="BIDDER">Bid on auctions (Bidder)</option>
            <option value="SELLER">Sell items (Seller)</option>
          </select>
          <label style={S.label}>MetaMask Wallet Address (optional)</label>
          <input style={S.input} placeholder="0x... (optional, for blockchain)" value={form.wallet_address} onChange={e => setForm({...form,wallet_address:e.target.value})} />
          <button style={S.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p style={S.foot}>Already have account? <Link to="/login" style={S.lnk}>Login</Link></p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  card: { background:'#1e293b', padding:40, borderRadius:20, width:'100%', maxWidth:440, border:'1px solid #334155' },
  h2: { color:'#f1f5f9', margin:'0 0 6px', fontSize:26, fontWeight:800 },
  sub: { color:'#64748b', marginBottom:28, fontSize:14 },
  label: { display:'block', color:'#94a3b8', fontSize:13, fontWeight:600, marginBottom:6 },
  input: { width:'100%', padding:'12px 16px', background:'#0f172a', border:'1px solid #334155', borderRadius:10, color:'#f1f5f9', fontSize:15, marginBottom:16, boxSizing:'border-box' },
  btn: { width:'100%', padding:14, background:'#f59e0b', color:'#0f172a', border:'none', borderRadius:10, fontWeight:800, fontSize:16, cursor:'pointer', marginTop:4 },
  foot: { marginTop:20, textAlign:'center', color:'#64748b', fontSize:14 },
  lnk: { color:'#f59e0b', fontWeight:700 }
};
