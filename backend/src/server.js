require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const initDB = require('./models/schema');
const { initBlockchain } = require('./services/blockchainService');
const { startAuctionCloser } = require('./services/auctionCloser');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Socket.io
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, methods: ['GET','POST'] }
});

io.on('connection', (socket) => {
  socket.on('joinAuction', (auctionId) => socket.join(`auction_${auctionId}`));
  socket.on('leaveAuction', (auctionId) => socket.leave(`auction_${auctionId}`));
});

app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Routes
app.use('/api', routes);
app.get('/health', (_, res) => res.json({ status: 'OK', time: new Date() }));
app.get('/', (_, res) => res.json({ message: 'BlockAuction API running ✅' }));

// Start
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await initDB();
    await initBlockchain();
    startAuctionCloser(io);
    server.listen(PORT, () => {
      console.log(`\n🚀 Backend running → http://localhost:${PORT}`);
      console.log(`📡 API ready     → http://localhost:${PORT}/api`);
      console.log(`❤️  Health check → http://localhost:${PORT}/health\n`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
})();
