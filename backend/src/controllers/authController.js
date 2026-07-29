const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'MyAuctionSecretKey2024';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

exports.register = async (req, res) => {
  const { name, email, password, role = 'BIDDER', wallet_address } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password required' });
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.rows.length)
      return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const inserted = await pool.query(
      'INSERT INTO users (name,email,password,role,wallet_address) VALUES (?,?,?,?,?)',
      [name, email, hash, role, wallet_address || null]
    );
    const userRes = await pool.query('SELECT id,name,email,role FROM users WHERE id=?', [inserted.insertId]);
    const user = userRes.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    res.status(201).json({ message: 'Registered successfully', user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!result.rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, wallet_address: user.wallet_address },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,email,role,wallet_address,created_at FROM users WHERE id=?', [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
