import React, { useState } from 'react';
import api from '../services/api';

export default function VerifyBlockchain() {
  const [auctionId, setAuctionId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.get(`/auctions/${auctionId}/verify`);
      setResult(data.record);
    } catch (err) {
      setError(err.response?.data?.error || 'No record found for this auction');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.h2}>🔗 Blockchain Verification</h2>
        <p style={S.sub}>Enter an Auction ID to verify its result is permanently recorded on the Ethereum blockchain.</p>
        <form onSubmit={handleVerify} style={S.form}>
          <input style={S.input} type="number" placeholder="Enter Auction ID (e.g. 1)" value={auctionId} onChange={e => setAuctionId(e.target.value)} required />
          <button style={S.btn} type="submit" disabled={loading}>{loading ? 'Verifying...' : '🔍 Verify'}</button>
        </form>
        {error && <div style={S.errorBox}>❌ {error}</div>}
        {result && (
          <div style={S.resultBox}>
            <h3 style={S.resultTitle}>✅ Record Found</h3>
            <table style={S.table}>
              <tbody>
                {[
                  ['Auction', result.auction_title],
                  ['Winner', result.winner_name],
                  ['Email', result.winner_email],
                  ['Winning Amount', `₹${Number(result.winning_amount).toLocaleString('en-IN')}`],
                  ['Recorded At', new Date(result.created_at).toLocaleString()],
                ].map(([k,v]) => (
                  <tr key={k}><td style={S.td1}>{k}</td><td style={{ ...S.td2, color: k === 'Winning Amount' ? '#22c55e' : '#f1f5f9', fontWeight: k === 'Winning Amount' ? 800 : 500 }}>{v}</td></tr>
                ))}
                <tr>
                  <td style={S.td1}>TX Hash</td>
                  <td style={S.td2}>
                    {result.tx_hash ? (
                      <>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'#60a5fa', wordBreak:'break-all' }}>{result.tx_hash}</span><br />
                        <a href={`https://sepolia.etherscan.io/tx/${result.tx_hash}`} target="_blank" rel="noreferrer" style={{ color:'#f59e0b', fontSize:12, fontWeight:700 }}>View on Etherscan ↗</a>
                      </>
                    ) : <span style={{ color:'#64748b' }}>⚠️ Not yet recorded on blockchain</span>}
                  </td>
                </tr>
                <tr>
                  <td style={S.td1}>Blockchain</td>
                  <td style={S.td2}><span style={{ color: result.blockchain_verified?'#22c55e':'#f59e0b', fontWeight:700 }}>{result.blockchain_verified ? '✅ Verified on Ethereum' : '⚠️ Pending (configure blockchain)'}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={S.infoBox}>
        <h3 style={{ color:'#f59e0b', margin:'0 0 12px' }}>Why Blockchain?</h3>
        <p style={{ color:'#94a3b8', margin:0, lineHeight:1.8 }}>
          Traditional databases can be modified by administrators. By recording auction results on Ethereum, 
          the winner becomes <strong style={{ color:'#f1f5f9' }}>permanently immutable</strong> — no one can change it. 
          Each transaction hash is publicly verifiable on Etherscan.
        </p>
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth:700, margin:'40px auto', padding:'0 20px' },
  card: { background:'#1e293b', padding:40, borderRadius:20, border:'1px solid #334155', marginBottom:24 },
  h2: { color:'#f1f5f9', fontWeight:800, fontSize:26, marginBottom:12 },
  sub: { color:'#64748b', lineHeight:1.6, marginBottom:24 },
  form: { display:'flex', gap:12, marginBottom:0 },
  input: { flex:1, padding:'12px 16px', background:'#0f172a', border:'1px solid #334155', borderRadius:10, color:'#f1f5f9', fontSize:15 },
  btn: { padding:'12px 24px', background:'#f59e0b', color:'#0f172a', border:'none', borderRadius:10, fontWeight:800, fontSize:15, cursor:'pointer', whiteSpace:'nowrap' },
  errorBox: { marginTop:20, background:'#2d1515', color:'#ef4444', padding:16, borderRadius:10, border:'1px solid #7f1d1d' },
  resultBox: { marginTop:24, background:'#0f172a', borderRadius:14, padding:24, border:'1px solid #334155' },
  resultTitle: { color:'#22c55e', margin:'0 0 16px', fontSize:18 },
  table: { width:'100%', borderCollapse:'collapse' },
  td1: { color:'#64748b', fontSize:13, fontWeight:700, padding:'10px 0', width:140, verticalAlign:'top' },
  td2: { color:'#f1f5f9', fontSize:14, padding:'10px 0' },
  infoBox: { background:'#1e293b', padding:28, borderRadius:16, border:'1px solid #334155' }
};
