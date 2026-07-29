import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auctions/my')
      .then(({ data }) => { setAuctions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.center}>Loading...</div>;

  const statusColor = { ACTIVE:'#22c55e', PENDING:'#f59e0b', CLOSED:'#64748b', CANCELLED:'#ef4444' };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.h2}>My Auctions</h2>
        <Link to="/create" style={S.createBtn}>+ New Auction</Link>
      </div>
      {!auctions.length && <p style={{ color:'#64748b' }}>No auctions yet. <Link to="/create" style={{ color:'#f59e0b' }}>Create one →</Link></p>}
      <div style={S.list}>
        {auctions.map(a => (
          <div key={a.id} style={S.row}>
            <div style={{ flex:1 }}>
              <div style={S.title}>{a.title}</div>
              <div style={S.meta}>{a.bid_count} bids · Ends {new Date(a.end_time).toLocaleString()}</div>
            </div>
            <div style={S.right}>
              <div style={{ color: statusColor[a.status] || '#64748b', fontWeight:700, fontSize:13, marginBottom:4 }}>{a.status}</div>
              <div style={S.price}>₹{Number(a.highest_bid || a.starting_price).toLocaleString('en-IN')}</div>
              <Link to={`/auction/${a.id}`} style={S.viewBtn}>View →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:900, margin:'40px auto', padding:'0 20px' },
  center: { textAlign:'center', padding:80, color:'#94a3b8' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  h2: { color:'#f1f5f9', fontWeight:800, margin:0 },
  createBtn: { background:'#f59e0b', color:'#0f172a', padding:'10px 20px', borderRadius:10, textDecoration:'none', fontWeight:800 },
  list: { display:'flex', flexDirection:'column', gap:12 },
  row: { background:'#1e293b', padding:'20px 24px', borderRadius:14, border:'1px solid #334155', display:'flex', alignItems:'center', gap:20 },
  title: { color:'#f1f5f9', fontWeight:600, fontSize:17, marginBottom:4 },
  meta: { color:'#64748b', fontSize:13 },
  right: { textAlign:'right', minWidth:130 },
  price: { color:'#f59e0b', fontWeight:800, fontSize:18, marginBottom:6 },
  viewBtn: { color:'#60a5fa', fontSize:13, textDecoration:'none', fontWeight:700 }
};
