import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuctions } from '../store/slices/auctionSlice';
import AuctionCard from '../components/auction/AuctionCard';

export default function Home() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(s => s.auctions);

  useEffect(() => { dispatch(fetchAuctions()); }, [dispatch]);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>🔨 Live Auctions</h1>
        <p style={S.sub}>Bid on items. Winners recorded on Ethereum blockchain.</p>
      </div>
      {loading && <p style={S.msg}>Loading auctions...</p>}
      {error && <p style={{...S.msg, color:'#ef4444'}}>{error}</p>}
      {!loading && !error && list.length === 0 && (
        <p style={S.msg}>No active auctions right now. Login as SELLER to create one!</p>
      )}
      <div style={S.grid}>
        {list.map(a => <AuctionCard key={a.id} auction={a} />)}
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:1100, margin:'0 auto', padding:'40px 20px' },
  header: { marginBottom:40, textAlign:'center' },
  h1: { color:'#f1f5f9', fontSize:36, fontWeight:800, marginBottom:10 },
  sub: { color:'#64748b', fontSize:16 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(310px,1fr))', gap:24 },
  msg: { color:'#94a3b8', textAlign:'center', padding:60, fontSize:16 }
};
