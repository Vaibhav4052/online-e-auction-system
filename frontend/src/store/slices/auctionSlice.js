import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAuctions = createAsyncThunk('auctions/fetchAll', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/auctions'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load'); }
});

export const fetchAuction = createAsyncThunk('auctions/fetchOne', async (id, { rejectWithValue }) => {
  try { const { data } = await api.get(`/auctions/${id}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load'); }
});

export const createAuction = createAsyncThunk('auctions/create', async (auctionData, { rejectWithValue }) => {
  try { const { data } = await api.post('/auctions', auctionData); return data.auction; }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to create'); }
});

export const placeBid = createAsyncThunk('auctions/placeBid', async (bidData, { rejectWithValue }) => {
  try { const { data } = await api.post('/bids', bidData); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to bid'); }
});

const auctionSlice = createSlice({
  name: 'auctions',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    updateCurrentPrice(state, action) {
      const { auction_id, current_price, bid } = action.payload;
      if (state.current?.auction?.id === parseInt(auction_id)) {
        state.current.auction.current_price = current_price;
        if (bid) state.current.bids = [bid, ...(state.current.bids || [])];
      }
      const item = state.list.find(a => a.id === parseInt(auction_id));
      if (item) item.current_price = current_price;
    },
    markAuctionClosed(state, action) {
      const { auction_id } = action.payload;
      if (state.current?.auction?.id === parseInt(auction_id))
        state.current.auction.status = 'CLOSED';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (s) => { s.loading = true; })
      .addCase(fetchAuctions.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchAuctions.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchAuction.pending, (s) => { s.loading = true; s.current = null; })
      .addCase(fetchAuction.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchAuction.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export const { updateCurrentPrice, markAuctionClosed } = auctionSlice.actions;
export default auctionSlice.reducer;
