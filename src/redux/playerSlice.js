import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    telegramId: '',
    username: '',
    points: 0,
    level: 1,
    happinessIndex: 50,
    maintenanceCost: 0,
    pointsPerClick: 1,
    clickComboCount: 0,
    lastClickTimestamp: '',
    createdAt: '',
    purchasedUpgrades: [],
    activeBoosts: []
  };

  const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
      updatePlayerData: (state, action) => {
        return { ...state, ...action.payload };
      },
      resetPlayerData: () => initialState,
    },
  });
  
  export const { updatePlayerData, resetPlayerData } = playerSlice.actions;
  
  export default playerSlice.reducer;
