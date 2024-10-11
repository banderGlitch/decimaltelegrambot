import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPlayer = createAsyncThunk('player/fetchPlayer', async (telegramId) => {
  const response = await axios.get(`/api/player/${telegramId}`);
  return response.data;
});

const playerSlice = createSlice({
  name: 'player',
  initialState: { player: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayer.pending, (state) => { state.loading = true; })
      .addCase(fetchPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.player = action.payload;
      })
      .addCase(fetchPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default playerSlice.reducer;
