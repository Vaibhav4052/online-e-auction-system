const cron = require('node-cron');
const pool = require('../config/db');
const { recordAuctionResult } = require('./blockchainService');

const startAuctionCloser = (io) => {
  cron.schedule('* * * * *', async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Activate pending auctions whose start time has come
      await client.query(`
        UPDATE auctions SET status='ACTIVE'
        WHERE status='PENDING' AND start_time <= NOW() AND end_time > NOW()
      `);

      // Find and close expired active auctions
      const expired = await client.query(`
        SELECT * FROM auctions WHERE status='ACTIVE' AND end_time <= NOW() FOR UPDATE
      `);

      for (const auction of expired.rows) {
        const bidRes = await client.query(`
          SELECT b.*,u.wallet_address FROM bids b
          JOIN users u ON b.user_id=u.id
          WHERE b.auction_id=? ORDER BY b.amount DESC LIMIT 1
        `, [auction.id]);

        if (bidRes.rows.length > 0) {
          const winner = bidRes.rows[0];
          const txHash = await recordAuctionResult(auction.id, winner.wallet_address, winner.amount);
          await client.query(`
            INSERT IGNORE INTO auction_results (auction_id,winner_id,winning_amount,tx_hash,blockchain_verified)
            VALUES (?,?,?,?,?)
          `, [auction.id, winner.user_id, winner.amount, txHash, !!txHash]);

          if (io) {
            io.to(`auction_${auction.id}`).emit('auctionClosed', {
              auction_id: auction.id,
              winner_id: winner.user_id,
              winning_amount: winner.amount,
              tx_hash: txHash
            });
          }
          console.log(`🏆 Auction ${auction.id} closed — winner: user ${winner.user_id}, ₹${winner.amount}`);
        }

        await client.query("UPDATE auctions SET status='CLOSED' WHERE id=?", [auction.id]);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Cron error:', err.message);
    } finally {
      client.release();
    }
  });
  console.log('⏰ Auction cron started (runs every minute)');
};

module.exports = { startAuctionCloser };
