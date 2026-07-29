import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bids/my')
      .then(({ data }) => { setBids(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.center}>Loading your bids...</div>;

  return (
    <div style={S.page}>
      <h2 style={S.h2}>My Bids</h2>
      {!bids.length && <p style={{ color:'#64748b' }}>You haven't placed any bids yet. <Link to="/" style={{ color:'#f59e0b' }}>Browse auctions →</Link></p>}
      <div style={S.list}>
        {bids.map(bid => (
          <div key={bid.id} style={S.row}>
            <div>
              <div style={S.title}>{bid.auction_title}</div>
              <div style={S.sub}>{new Date(bid.created_at).toLocaleString()}</div>
            </div>
            <div style={S.right}>
              <div style={S.amount}>₹{Number(bid.amount).toLocaleString('en-IN')}</div>
              <div style={{ color: Number(bid.auction_current_price) === Number(bid.amount) ? '#22c55e' : '#64748b', fontSize:12, fontWeight:700 }}>
                {bid.auction_status === 'CLOSED'
                  ? (Number(bid.auction_current_price) === Number(bid.amount) ? '🏆 Won' : '❌ Outbid')
                  : (Number(bid.auction_current_price) === Number(bid.amount) ? '👑 Leading' : '⬇️ Outbid')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:800, margin:'40px auto', padding:'0 20px' },
  center: { textAlign:'center', padding:80, color:'#94a3b8' },
  h2: { color:'#f1f5f9', fontWeight:800, marginBottom:24 },
  list: { display:'flex', flexDirection:'column', gap:12 },
  row: { background:'#1e293b', padding:'18px 24px', borderRadius:14, border:'1px solid #334155', display:'flex', justifyContent:'space-between', alignItems:'center' },
  title: { color:'#f1f5f9', fontWeight:600, marginBottom:4 },
  sub: { color:'#64748b', fontSize:12 },
  right: { textAlign:'right' },
  amount: { color:'#f59e0b', fontWeight:800, fontSize:20 }
};
