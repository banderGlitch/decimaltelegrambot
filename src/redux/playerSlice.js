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
    tasks: [],
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

      verifyTask: (state, action) => {
        const { taskId, reward } = action.payload;
        console.log("taskId----inredux->", taskId);
        console.log("reward----inredux->", reward);
        // state.points += reward;
        state.points = state.points + Number(reward);
        console.log("state.points----->", state.points);
        const taskIndex = state.tasks.findIndex(task => task.taskId === taskId);
        console.log("taskIndex---inplayerdata-->", taskIndex);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].completed = true;
        } else {
          state.tasks.push({ taskId, completed: true, _id: `task_${Date.now()}` });
        }
      },
      resetPlayerData: () => initialState,
    },
  });
  
  export const { updatePlayerData, resetPlayerData, updatePurchasedUpgradeCost, verifyTask } = playerSlice.actions;
  
  export default playerSlice.reducer;
