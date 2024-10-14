import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import upgradesReducer from './upgradeSlice';
import tasksReducer from './taskSlice';
const store = configureStore({
  reducer: {
    player: playerReducer,
    upgrades: upgradesReducer,
    tasks: tasksReducer,
  },
});

export default store;