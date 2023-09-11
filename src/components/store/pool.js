import {createSlice} from '@reduxjs/toolkit'

const poolSlice = createSlice({
    name: 'pool',
    initialState: {
        markList: [],

    },
    reducers: {
        initMarkList: (state, action) => {
            state.markList = action.payload;
        },
        insertMarkList: (state, action) => {
            if (state.markList.find(value => value.id === action.payload.id)) return;
            state.markList = [...state.markList, action.payload];
        },
        deleteMarkList: (state, action) => {
            state.markList = state.markList.filter(v => v.id !== action.payload);
        }
    }
});

export const {
    initMarkList,
    insertMarkList,
    deleteMarkList,
} = poolSlice.actions;
export default poolSlice.reducer;