import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import upgradesReducer from './upgradeSlice';

const store = configureStore({
  reducer: {
    player: playerReducer,
    upgrades: upgradesReducer,
  },
});

export default store;