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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null
};


export const registerOrUpdateUser = createAsyncThunk<
  { user: User;},
  Partial<User>
>(
  'user/registerOrUpdate',
  async (userData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/getUser`, userData);
    // Only return the data we need, excluding headers and other non-serializable parts
    return {
      user: response.data.user,
    };
  }
);



export const updateCoinsOnServer = createAsyncThunk<
void,
void,
{ state: { user: UserState } }
>(
  'user/updateCoins',
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().user;
    if (!user) {
      return rejectWithValue('No user found');
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/updateCoins`, {
        telegramId: user.telegramId,
        coins: user.coins
      });
      console.log('response----------->', response)
      // return { coins: response.data.coins };
    } catch (error) {
      return rejectWithValue('Failed to update coins on server');
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCoins: (state, action: PayloadAction<number>) => {
      console.log('addCoins---------------------->', action.payload)
      if (state.user) {
        state.user.coins += action.payload;
        console.log('state.user.coins---------------------->', state.user.coins)
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
        // state.isNewUser = action.payload.isNewUser;
      })
      .addCase(registerOrUpdateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // .addCase(updateCoinsOnServer.fulfilled, (state, action) => {
      //   if (state.user) {
      //     state.user.coins = action.payload.coins;
      //   }
      // });
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





