import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuction, placeBid, updateCurrentPrice, markAuctionClosed } from '../store/slices/auctionSlice';
import { joinAuction, leaveAuction, onNewBid, onAuctionClosed } from '../services/socket';
import Countdown from '../components/auction/Countdown';
import toast from 'react-hot-toast';

export default function AuctionDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector(s => s.auctions);
  const { user } = useSelector(s => s.auth);
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);

  useEffect(() => {
    dispatch(fetchAuction(id));
    joinAuction(id);
    const offBid = onNewBid((data) => {
      if (String(data.auction_id) === String(id)) {
        dispatch(updateCurrentPrice(data));
        toast.success(`New bid: ₹${Number(data.current_price).toLocaleString('en-IN')}`);
      }
    });
    const offClose = onAuctionClosed((data) => {
      if (String(data.auction_id) === String(id)) {
        dispatch(markAuctionClosed(data));
        toast(`🏆 Auction closed! Winner: ₹${Number(data.winning_amount).toLocaleString('en-IN')}`, { icon:'🎉', duration:6000 });
        dispatch(fetchAuction(id));
      }
    });
    return () => { leaveAuction(id); offBid(); offClose(); };
  }, [id, dispatch]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to bid');
    setBidding(true);
    const result = await dispatch(placeBid({ auction_id: Number(id), amount: Number(bidAmount) }));
    setBidding(false);
    if (!result.error) { toast.success('✅ Bid placed!'); setBidAmount(''); }
    else toast.error(result.payload);
  };

  if (loading) return <div style={S.center}>Loading auction...</div>;
  if (!current) return <div style={S.center}>Auction not found.</div>;

  const { auction, bids, result } = current;
  const isActive = auction.status === 'ACTIVE';
  const isClosed = auction.status === 'CLOSED';
  const minBid = Number(auction.current_price) + 1;

  return (
    <div style={S.page}>
      <div style={S.grid}>
        <div>
          <h1 style={S.h1}>{auction.title}</h1>
          <p style={S.desc}>{auction.description}</p>
          <div style={S.infoGrid}>
            <div style={S.box}><div style={S.lbl}>Current Price</div><div style={S.bigPrice}>₹{Number(auction.current_price).toLocaleString('en-IN')}</div></div>
            <div style={S.box}><div style={S.lbl}>Starting Price</div><div style={S.val}>₹{Number(auction.starting_price).toLocaleString('en-IN')}</div></div>
            <div style={S.box}><div style={S.lbl}>Seller</div><div style={S.val}>{auction.seller_name}</div></div>
            <div style={S.box}><div style={S.lbl}>Status</div><div style={{ color: isActive?'#22c55e':'#ef4444', fontWeight:700 }}>{auction.status}</div></div>
          </div>
          {isActive && <div style={{ marginBottom:20 }}><Countdown endTime={auction.end_time} /></div>}
          {isClosed && result && (
            <div style={S.winnerBox}>
              <h3 style={{ color:'#f59e0b', margin:'0 0 12px' }}>🏆 Auction Winner</h3>
              <p style={{ color:'#94a3b8', marginBottom:6 }}>Winner: <strong style={{ color:'#f1f5f9' }}>{result.winner_name}</strong></p>
              <p style={{ color:'#94a3b8', marginBottom:12 }}>Winning Amount: <strong style={{ color:'#22c55e', fontSize:20 }}>₹{Number(result.winning_amount).toLocaleString('en-IN')}</strong></p>
              {result.tx_hash ? (
                <div style={S.txBox}>
                  <div style={S.txLabel}>🔗 Blockchain TX Hash</div>
                  <div style={S.txHash}>{result.tx_hash}</div>
                  <a href={`https://sepolia.etherscan.io/tx/${result.tx_hash}`} target="_blank" rel="noreferrer" style={S.ethLink}>View on Etherscan ↗</a>
                </div>
              ) : (
                <p style={{ color:'#64748b', fontSize:13 }}>⚠️ Blockchain recording pending (configure blockchain in .env)</p>
              )}
            </div>
          )}
        </div>
        <div>
          {isActive && user?.role === 'BIDDER' && (
            <div style={S.bidBox}>
              <h3 style={S.bidTitle}>Place Your Bid</h3>
              <p style={S.bidSub}>Minimum: ₹{minBid.toLocaleString('en-IN')}</p>
              <form onSubmit={handleBid}>
                <input style={S.bidInput} type="number" value={bidAmount} min={minBid}
                  onChange={e => setBidAmount(e.target.value)} placeholder={`₹${minBid} or more`} required />
                <button style={S.bidBtn} type="submit" disabled={bidding}>
                  {bidding ? 'Placing...' : '⚡ Bid Now'}
                </button>
              </form>
            </div>
          )}
          {isActive && !user && <div style={S.loginPrompt}><Link to="/login" style={S.loginLink}>Login to place a bid</Link></div>}
          <div style={S.bidsBox}>
            <h3 style={S.bidsTitle}>🔴 Live Bids ({bids?.length || 0})</h3>
            {!bids?.length && <p style={{ color:'#64748b', fontSize:14 }}>No bids yet. Be the first!</p>}
            {bids?.map((bid, i) => (
              <div key={bid.id || i} style={{ ...S.bidRow, background: i===0?'#1a2e1a':'#0f172a' }}>
                <span style={{ color:'#94a3b8' }}>{i===0?'👑 ':''}{bid.bidder_name || 'Bidder'}</span>
                <span style={{ color: i===0?'#22c55e':'#f1f5f9', fontWeight: i===0?800:500 }}>₹{Number(bid.amount).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:1100, margin:'0 auto', padding:'40px 20px' },
  center: { textAlign:'center', padding:80, color:'#94a3b8' },
  grid: { display:'grid', gridTemplateColumns:'1fr 360px', gap:40 },
  h1: { color:'#f1f5f9', fontSize:28, fontWeight:800, marginBottom:12 },
  desc: { color:'#94a3b8', lineHeight:1.6, marginBottom:24 },
  infoGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 },
  box: { background:'#1e293b', padding:16, borderRadius:12, border:'1px solid #334155' },
  lbl: { color:'#64748b', fontSize:11, fontWeight:700, textTransform:'uppercase', marginBottom:6 },
  val: { color:'#f1f5f9', fontWeight:600, fontSize:16 },
  bigPrice: { color:'#f59e0b', fontWeight:900, fontSize:24 },
  winnerBox: { background:'#1a2e1a', border:'1px solid #22c55e', borderRadius:14, padding:20, marginTop:20 },
  txBox: { background:'#0f172a', borderRadius:10, padding:14 },
  txLabel: { color:'#64748b', fontSize:11, fontWeight:700, marginBottom:6 },
  txHash: { color:'#60a5fa', fontSize:11, wordBreak:'break-all', fontFamily:'monospace', marginBottom:8 },
  ethLink: { color:'#f59e0b', fontSize:12, textDecoration:'none', fontWeight:700 },
  bidBox: { background:'#1e293b', borderRadius:16, padding:24, border:'1px solid #334155', marginBottom:20 },
  bidTitle: { color:'#f1f5f9', fontWeight:800, margin:'0 0 4px' },
  bidSub: { color:'#64748b', fontSize:13, marginBottom:16 },
  bidInput: { width:'100%', padding:'14px 16px', background:'#0f172a', border:'1px solid #334155', borderRadius:10, color:'#f1f5f9', fontSize:16, marginBottom:14, boxSizing:'border-box' },
  bidBtn: { width:'100%', padding:14, background:'#f59e0b', color:'#0f172a', border:'none', borderRadius:10, fontWeight:800, fontSize:16, cursor:'pointer' },
  loginPrompt: { background:'#1e293b', borderRadius:16, padding:24, border:'1px solid #334155', marginBottom:20, textAlign:'center' },
  loginLink: { color:'#f59e0b', fontWeight:700, textDecoration:'none', fontSize:15 },
  bidsBox: { background:'#1e293b', borderRadius:16, padding:24, border:'1px solid #334155' },
  bidsTitle: { color:'#f1f5f9', fontWeight:700, margin:'0 0 16px' },
  bidRow: { display:'flex', justifyContent:'space-between', padding:'10px 14px', borderRadius:8, marginBottom:6 }
};
