import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id: string;
  telegramId: string;
  name: string;
  username: string;
  photoUrl: string;
  coins: number;
}

export interface UserState {
  user: User | null;
  isNewUser: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


const initialState: UserState = {
  user: null,
  isNewUser: false,
  status: 'idle',
  error: null
};


export const registerOrUpdateUser = createAsyncThunk<
  { user: User; isNewUser: boolean },
  Partial<User>
>(
  'user/registerOrUpdate',
  async (userData) => {
    const response = await axios.post('http://localhost:9000/api/users/getUser', userData);
    // Only return the data we need, excluding headers and other non-serializable parts
    return {
      user: response.data.user,
      isNewUser: response.data.isNewUser
    };
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCoins: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.coins += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerOrUpdateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerOrUpdateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isNewUser = action.payload.isNewUser;
      })
      .addCase(registerOrUpdateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addCoins } = userSlice.actions;
export default userSlice.reducer;







// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface TelegramUser {
//   id: number;
//   name: string;
//   username?: string;
//   photo_url?: string;
// }

// export interface UserState {
//   user: TelegramUser | null;
//   debugInfo: string;
//   coins: number;
// }

// const initialState: UserState = {
//   user: null,
//   debugInfo: '',
//   coins: 0,
// };


// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<TelegramUser>) => {
//       state.user = action.payload;
//     },
//     setDebugInfo: (state, action: PayloadAction<string>) => {
//       state.debugInfo = action.payload;
//     },
//     // ... existing reducers ...
//     addCoins: (state, action: PayloadAction<number>) => {
//       state.coins += action.payload;
//     },
//   },
// });

// export const { setUser, setDebugInfo, addCoins } = userSlice.actions;
// export default userSlice.reducer;





