const pool = require('../config/db');

exports.placeBid = async (req, res) => {
  const { auction_id, amount } = req.body;
  const user_id = req.user.id;
  if (!auction_id || !amount)
    return res.status(400).json({ error: 'auction_id and amount required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const auctionRes = await client.query('SELECT * FROM auctions WHERE id=? FOR UPDATE', [auction_id]);
    if (!auctionRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Auction not found' });
    }
    const auction = auctionRes.rows[0];
    if (auction.status !== 'ACTIVE') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Auction is not active' });
    }
    if (new Date() > new Date(auction.end_time)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Auction has ended' });
    }
    if (auction.seller_id === user_id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Sellers cannot bid on own auction' });
    }
    if (parseFloat(amount) <= parseFloat(auction.current_price)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Bid must be higher than ₹${auction.current_price}` });
    }

    const inserted = await client.query(
      'INSERT INTO bids (auction_id,user_id,amount) VALUES (?,?,?)',
      [auction_id, user_id, amount]
    );
    const bidRes = await client.query('SELECT * FROM bids WHERE id=?', [inserted.insertId]);
    await client.query('UPDATE auctions SET current_price=? WHERE id=?', [amount, auction_id]);
    await client.query('COMMIT');

    const bid = { ...bidRes.rows[0], bidder_name: req.user.email };
    const io = req.app.get('io');
    if (io) io.to(`auction_${auction_id}`).emit('newBid', { auction_id, current_price: amount, bid });

    res.status(201).json({ message: 'Bid placed!', bid });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.getAuctionBids = async (req, res) => {
  const { auction_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT b.id,b.amount,b.created_at,u.name as bidder_name FROM bids b JOIN users u ON b.user_id=u.id WHERE b.auction_id=? ORDER BY b.amount DESC',
      [auction_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBids = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*,a.title as auction_title,a.status as auction_status,
             a.current_price as auction_current_price,a.end_time
      FROM bids b JOIN auctions a ON b.auction_id=a.id
      WHERE b.user_id=? ORDER BY b.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
