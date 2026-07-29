const pool = require('../config/db');

exports.createAuction = async (req, res) => {
  const { title, description, starting_price, start_time, end_time, image_url } = req.body;
  if (!title || !starting_price || !start_time || !end_time)
    return res.status(400).json({ error: 'Title, starting price, start and end time are required' });
  if (new Date(end_time) <= new Date(start_time))
    return res.status(400).json({ error: 'End time must be after start time' });
  try {
    const inserted = await pool.query(
      `INSERT INTO auctions (title,description,starting_price,current_price,image_url,seller_id,status,start_time,end_time)
       VALUES (?,?,?,?,?,?,'PENDING',?,?)`,
      [title, description || '', starting_price, starting_price, image_url || null, req.user.id, start_time, end_time]
    );
    const auctionRes = await pool.query('SELECT * FROM auctions WHERE id=?', [inserted.insertId]);
    res.status(201).json({ message: 'Auction created', auction: auctionRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAuctions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.name as seller_name,
        (SELECT COUNT(*) FROM bids b WHERE b.auction_id=a.id) as bid_count
      FROM auctions a
      JOIN users u ON a.seller_id=u.id
      WHERE a.status='ACTIVE'
      ORDER BY a.end_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAuction = async (req, res) => {
  const { id } = req.params;
  try {
    const auctionRes = await pool.query(
      'SELECT a.*,u.name as seller_name FROM auctions a JOIN users u ON a.seller_id=u.id WHERE a.id=?', [id]
    );
    if (!auctionRes.rows.length) return res.status(404).json({ error: 'Auction not found' });

    const bidsRes = await pool.query(
      'SELECT b.*,u.name as bidder_name FROM bids b JOIN users u ON b.user_id=u.id WHERE b.auction_id=? ORDER BY b.amount DESC LIMIT 20',
      [id]
    );
    const resultRes = await pool.query('SELECT * FROM auction_results WHERE auction_id=?', [id]);

    res.json({ auction: auctionRes.rows[0], bids: bidsRes.rows, result: resultRes.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyAuctions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*,
        (SELECT COUNT(*) FROM bids b WHERE b.auction_id=a.id) as bid_count,
        (SELECT MAX(amount) FROM bids b WHERE b.auction_id=a.id) as highest_bid
      FROM auctions a WHERE a.seller_id=? ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyBlockchain = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT ar.*,u.name as winner_name,u.email as winner_email,a.title as auction_title
      FROM auction_results ar
      JOIN users u ON ar.winner_id=u.id
      JOIN auctions a ON ar.auction_id=a.id
      WHERE ar.auction_id=?
    `, [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'No blockchain record found for this auction' });
    res.json({ message: 'Record found', record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
