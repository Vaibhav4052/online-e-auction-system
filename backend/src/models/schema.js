const pool = require('../config/db');

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('ADMIN','SELLER','BIDDER') DEFAULT 'BIDDER',
        wallet_address VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        starting_price DECIMAL(12,2) NOT NULL,
        current_price DECIMAL(12,2) NOT NULL,
        image_url TEXT,
        seller_id INT,
        status ENUM('PENDING','ACTIVE','CLOSED','CANCELLED') DEFAULT 'PENDING',
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id INT AUTO_INCREMENT PRIMARY KEY,
        auction_id INT,
        user_id INT,
        amount DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS auction_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        auction_id INT UNIQUE,
        winner_id INT,
        winning_amount DECIMAL(12,2) NOT NULL,
        tx_hash VARCHAR(100),
        blockchain_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions(id),
        FOREIGN KEY (winner_id) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    console.log('✅ Database tables ready');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = initDB;
