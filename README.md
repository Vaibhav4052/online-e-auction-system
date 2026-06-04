# ⚡ Excomfy.com — Secure Online E-Auction System Using Blockchain

Final Year Engineering Project | React + Node.js + PostgreSQL + Ethereum Blockchain

---

## 🏗️ Architecture Overview

```
React Frontend (Port 3000)
       │
       │ HTTP + WebSocket (Socket.io)
       ▼
Express Backend (Port 5000)
       │
   ┌───┴────────────┐
   ▼                ▼
PostgreSQL      Ethereum
Database        Blockchain
                (Sepolia Testnet)
```

## 📁 Project Structure

```
auction-system/
├── backend/
│   ├── contracts/
│   │   └── AuctionRecord.sol      ← Solidity smart contract
│   ├── scripts/
│   │   └── deploy.js              ← Hardhat deploy script
│   ├── src/
│   │   ├── config/db.js           ← PostgreSQL connection
│   │   ├── controllers/
│   │   │   ├── authController.js  ← Register, Login, Profile
│   │   │   ├── auctionController.js ← Auction CRUD
│   │   │   └── bidController.js   ← Bid + Socket.io emit
│   │   ├── middleware/auth.js     ← JWT + Role middleware
│   │   ├── models/schema.js       ← DB table creation
│   │   ├── routes/index.js        ← All API routes
│   │   ├── services/
│   │   │   ├── blockchainService.js ← ethers.js blockchain calls
│   │   │   └── auctionCloser.js   ← Cron: auto-close auctions
│   │   └── server.js              ← Express + Socket.io server
│   ├── .env.example
│   ├── hardhat.config.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── auction/
        │   │   ├── AuctionCard.js ← Card on homepage
        │   │   └── Countdown.js   ← Live timer
        │   └── layout/Navbar.js
        ├── pages/
        │   ├── Home.js            ← Auction listing
        │   ├── Login.js
        │   ├── Register.js
        │   ├── AuctionDetail.js   ← Live bidding + Socket.io
        │   ├── CreateAuction.js   ← Seller creates auction
        │   ├── MyBids.js
        │   ├── MyAuctions.js
        │   └── VerifyBlockchain.js ← 🔥 Blockchain verify page
        ├── services/
        │   ├── api.js             ← Axios with JWT interceptor
        │   └── socket.js          ← Socket.io client helpers
        ├── store/
        │   ├── index.js           ← Redux store
        │   └── slices/
        │       ├── authSlice.js
        │       └── auctionSlice.js
        ├── App.js                 ← Routes
        └── index.js
```

---

## 🚀 STEP-BY-STEP SETUP GUIDE

### STEP 1: Install Prerequisites

- Node.js v18+ → https://nodejs.org
- PostgreSQL → https://postgresql.org/download
- Git

---

### STEP 2: Set Up PostgreSQL Database

Open psql or pgAdmin and run:

```sql
CREATE DATABASE auction_db;
```

That's it. Tables are created automatically when backend starts.

---

### STEP 3: Set Up Backend

```bash
cd auction-system/backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auction_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=any_random_long_string_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000

# Leave blockchain vars empty for now (works without them)
PRIVATE_KEY=
RPC_URL=
CONTRACT_ADDRESS=
```

Start backend:
```bash
npm run dev
```

You should see:
```
✅ PostgreSQL connected
✅ Database tables initialized
⚠️  Blockchain env vars not set — blockchain features disabled
⏰ Auction closer cron started
🚀 Server running at http://localhost:5000
```

---

### STEP 4: Set Up Frontend

```bash
cd auction-system/frontend
npm install
npm start
```

Browser opens at http://localhost:3000 ✅

---

### STEP 5: Test the App (Without Blockchain)

1. Register as SELLER → create an auction (set start_time = now, end_time = 5 min from now)
2. Register as BIDDER → go to auction → place bids
3. Watch real-time updates via Socket.io
4. After end_time, cron will auto-close the auction

Everything works WITHOUT blockchain. Blockchain is bonus.

---

### STEP 6: Add Blockchain (Optional but Impressive)

#### 6a. Get Infura RPC URL
1. Go to https://infura.io → Sign up free
2. Create project → Copy Sepolia endpoint URL
3. Paste as `RPC_URL=https://sepolia.infura.io/v3/YOUR_ID`

#### 6b. Get Test ETH
1. Install MetaMask browser extension → Create wallet
2. Switch to Sepolia Testnet
3. Go to https://sepoliafaucet.com → Get free test ETH
4. Copy your private key from MetaMask: Settings → Security → Export Private Key
5. Paste as `PRIVATE_KEY=0x...`

#### 6c. Deploy Smart Contract
```bash
cd auction-system/backend
npm install --save-dev @nomicfoundation/hardhat-toolbox hardhat
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

You'll see:
```
✅ AuctionRecord deployed to: 0xYourContractAddress
```

Copy that address → `CONTRACT_ADDRESS=0xYourContractAddress` in `.env`

Restart backend → blockchain is now active!

---

## 📡 API Reference

### Auth
| Method | URL | Body | Auth |
|--------|-----|------|------|
| POST | /api/auth/register | name, email, password, role | - |
| POST | /api/auth/login | email, password | - |
| GET | /api/auth/profile | - | JWT |

### Auctions
| Method | URL | Auth |
|--------|-----|------|
| GET | /api/auctions | - |
| GET | /api/auctions/:id | - |
| POST | /api/auctions | SELLER |
| GET | /api/auctions/my | SELLER |
| GET | /api/auctions/:id/verify | - |

### Bids
| Method | URL | Auth |
|--------|-----|------|
| POST | /api/bids | BIDDER |
| GET | /api/bids/auction/:id | - |
| GET | /api/bids/my | Any |

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| joinAuction | Client → Server | Join auction room |
| leaveAuction | Client → Server | Leave auction room |
| newBid | Server → Client | New bid placed |
| auctionClosed | Server → Client | Auction ended with winner |

---

## 🔒 Security Features

- **JWT Authentication** — Stateless tokens, 7-day expiry
- **Role-Based Access** — ADMIN / SELLER / BIDDER roles
- **bcrypt Passwords** — 12 salt rounds
- **Rate Limiting** — 100 requests/15 min per IP
- **Helmet** — HTTP security headers
- **SQL Injection Prevention** — Parameterized queries
- **Blockchain Immutability** — Winners cannot be changed

---

## 💡 Interview Talking Points

1. **Why blockchain?** "Traditional DB allows admin to change winner. Blockchain makes it immutable — verifiable by anyone on Etherscan."

2. **Why Socket.io?** "HTTP polling wastes bandwidth. Socket.io creates a persistent WebSocket connection — all bidders see updates in real-time."

3. **Race condition in bidding?** "We use PostgreSQL row-level locking (`FOR UPDATE`) inside a transaction to prevent two bids from both seeing the same current price."

4. **Cron for auction closing?** "A Node-cron job checks every minute for expired auctions, finds the winner, records on blockchain, and emits Socket.io event."

5. **JWT vs sessions?** "JWT is stateless — no DB lookup on every request. Perfect for scaling horizontally."

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React, Redux Toolkit, React Router |
| Styling | Inline CSS (dark theme) |
| Real-time | Socket.io |
| Backend | Node.js, Express |
| Auth | JWT, bcrypt |
| Database | PostgreSQL |
| Blockchain | Solidity, Hardhat, ethers.js, Ethereum Sepolia |
| Scheduling | node-cron |
| Security | Helmet, express-rate-limit |
