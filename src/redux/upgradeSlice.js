import { createSlice } from '@reduxjs/toolkit';

const upgradesSlice = createSlice({
  name: 'upgrades',
  initialState: [],
  reducers: {
    setUpgrades: (state, action) => {
      return action.payload;
    },
  },
});

export const { setUpgrades } = upgradesSlice.actions;

export default upgradesSlice.reducer;