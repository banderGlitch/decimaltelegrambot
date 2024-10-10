import { createSlice , PayloadAction } from "@reduxjs/toolkit";

export interface HippoData {
    telegramId: string;
    name: string;
    points: number;
    level: number;
    clickCount: number;
    streakCount: number;
    happinessIndex: number;
    comboBonus: number;
    lastClickTime: string;
    createdAt: string;
    purchasedUpgrades: Array<any>;
}

export interface updatedata {
    points: number;
    level: number;
    clickCount: number;
    streakCount: number;
    happinessIndex: number;
    comboBonus: number;
    lastClickTime: string;
    createdAt: string;
    purchasedUpgrades: Array<any>;
}
export interface HippoState {
    hippodata: HippoData | null;
    // status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: HippoState = {
    hippodata: null,
    // status: 'idle',
}


const hippoSlice = createSlice({
    name: 'hippo',
    initialState,
    reducers: {
        setHippoData: (state, action: PayloadAction<HippoData>) => {
            state.hippodata = action.payload;
            // state.status = 'succeeded';
        },
        updateHippoData: (state, action: PayloadAction<Partial<HippoData>>) => {
            if (state.hippodata) {
                state.hippodata = { ...state.hippodata, ...action.payload };
            }
        },
        // setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
        //     state.status = action.payload;
        // },
    },
});

export const { setHippoData, updateHippoData } = hippoSlice.actions;
export default hippoSlice.reducer;

