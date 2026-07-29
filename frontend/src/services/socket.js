import { io } from 'socket.io-client';

let socket = null;

const getSocket = () => {
  if (!socket) socket = io('http://localhost:5000');
  return socket;
};

export const joinAuction = (id) => getSocket().emit('joinAuction', id);
export const leaveAuction = (id) => getSocket().emit('leaveAuction', id);
export const onNewBid = (cb) => { getSocket().on('newBid', cb); return () => getSocket().off('newBid', cb); };
export const onAuctionClosed = (cb) => { getSocket().on('auctionClosed', cb); return () => getSocket().off('auctionClosed', cb); };
