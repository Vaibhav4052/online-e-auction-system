import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAuction } from '../store/slices/auctionSlice';
import toast from 'react-hot-toast';

export default function CreateAuction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const startDefault = new Date(now.getTime() + 2 * 60000).toISOString().slice(0,16);
  const endDefault = new Date(now.getTime() + 60 * 60000).toISOString().slice(0,16);
  const [form, setForm] = useState({ title:'', description:'', starting_price:'', image_url:'', start_time: startDefault, end_time: endDefault });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createAuction(form));
    setLoading(false);
    if (!result.error) { toast.success('Auction created!'); navigate('/my-auctions'); }
    else toast.error(result.payload);
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.h2}>📦 Create New Auction</h2>
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Item Title *</label>
          <input style={S.input} placeholder="e.g. MacBook Pro 2023" value={form.title} onChange={e => setForm({...form,title:e.target.value})} required />
          <label style={S.label}>Description</label>
          <textarea style={{...S.input, height:90, resize:'vertical'}} placeholder="Describe the item..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
          <label style={S.label}>Starting Price (₹) *</label>
          <input style={S.input} type="number" min="1" placeholder="1000" value={form.starting_price} onChange={e => setForm({...form,starting_price:e.target.value})} required />
          <label style={S.label}>Image URL (optional)</label>
          <input style={S.input} type="url" placeholder="https://..." value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})} />
          <label style={S.label}>Start Time *</label>
          <input style={S.input} type="datetime-local" value={form.start_time} onChange={e => setForm({...form,start_time:e.target.value})} required />
          <label style={S.label}>End Time *</label>
          <input style={S.input} type="datetime-local" value={form.end_time} onChange={e => setForm({...form,end_time:e.target.value})} required />
          <button style={S.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Auction'}</button>
        </form>
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:600, margin:'40px auto', padding:'0 20px' },
  card: { background:'#1e293b', padding:40, borderRadius:20, border:'1px solid #334155' },
  h2: { color:'#f1f5f9', fontWeight:800, fontSize:24, marginBottom:28 },
  label: { display:'block', color:'#94a3b8', fontSize:13, fontWeight:600, marginBottom:6 },
  input: { width:'100%', padding:'12px 16px', background:'#0f172a', border:'1px solid #334155', borderRadius:10, color:'#f1f5f9', fontSize:15, marginBottom:18, boxSizing:'border-box' },
  btn: { width:'100%', padding:14, background:'#f59e0b', color:'#0f172a', border:'none', borderRadius:10, fontWeight:800, fontSize:16, cursor:'pointer' }
};
