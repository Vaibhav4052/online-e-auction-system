import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';

export default function AuctionCard({ auction }) {
  const { id, title, description, current_price, starting_price, end_time, seller_name, bid_count } = auction;
  return (
    <div style={S.card}>
      <div style={S.body}>
        <h3 style={S.title}>{title}</h3>
        <p style={S.desc}>{(description || '').slice(0, 80)}{(description || '').length > 80 ? '...' : ''}</p>
        <div style={S.row}>
          <div>
            <div style={S.label}>Current Price</div>
            <div style={S.price}>₹{Number(current_price).toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div style={S.label}>Starting</div>
            <div style={S.starting}>₹{Number(starting_price).toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div style={S.meta}>
          <span>👤 {seller_name}</span>
          <span>🔨 {bid_count || 0} bids</span>
        </div>
        <div style={S.footer}>
          <Countdown endTime={end_time} />
          <Link to={`/auction/${id}`} style={S.btn}>Bid Now →</Link>
        </div>
      </div>
    </div>
  );
}

const S = {
  card: { background:'#1e293b', borderRadius:16, border:'1px solid #334155', overflow:'hidden' },
  body: { padding:20 },
  title: { color:'#f1f5f9', fontWeight:700, fontSize:18, marginBottom:6 },
  desc: { color:'#94a3b8', fontSize:13, marginBottom:16 },
  row: { display:'flex', gap:24, marginBottom:12 },
  label: { color:'#64748b', fontSize:11, fontWeight:600, textTransform:'uppercase', marginBottom:2 },
  price: { color:'#f59e0b', fontSize:20, fontWeight:800 },
  starting: { color:'#94a3b8', fontSize:14, fontWeight:600 },
  meta: { display:'flex', gap:16, color:'#64748b', fontSize:12, marginBottom:16 },
  footer: { display:'flex', alignItems:'center', justifyContent:'space-between' },
  btn: { background:'#f59e0b', color:'#0f172a', textDecoration:'none', padding:'8px 18px', borderRadius:10, fontWeight:700, fontSize:13 }
};
