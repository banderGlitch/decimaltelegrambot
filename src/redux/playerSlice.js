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
    activeBoosts: [],
  };

  const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
      updatePlayerData: (state, action) => {
        return { ...state, ...action.payload };
      },
      updatePurchasedUpgradeCost: (state, action) => {
        const { upgradeId, cost } = action.payload;
        const upgradeIndex = state.purchasedUpgrades.findIndex(upgrade => upgrade.upgradeId === upgradeId);
        if (upgradeIndex !== -1) {
          state.purchasedUpgrades[upgradeIndex].cost = cost;
        }
      },
      resetPlayerData: () => initialState,
    },
  });
  
  export const { updatePlayerData, resetPlayerData, updatePurchasedUpgradeCost } = playerSlice.actions;
  
  export default playerSlice.reducer;
