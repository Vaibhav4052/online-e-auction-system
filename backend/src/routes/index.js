const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auctionController = require('../controllers/auctionController');
const bidController = require('../controllers/bidController');
const auth = require('../middleware/auth');

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', auth(), authController.getProfile);

// Auctions
router.get('/auctions', auctionController.getAllAuctions);
router.get('/auctions/my', auth(['SELLER','ADMIN']), auctionController.getMyAuctions);
router.get('/auctions/:id', auctionController.getAuction);
router.post('/auctions', auth(['SELLER','ADMIN']), auctionController.createAuction);
router.get('/auctions/:id/verify', auctionController.verifyBlockchain);

// Bids
router.post('/bids', auth(['BIDDER','ADMIN']), bidController.placeBid);
router.get('/bids/auction/:auction_id', bidController.getAuctionBids);
router.get('/bids/my', auth(), bidController.getMyBids);

module.exports = router;
