import {createSlice} from '@reduxjs/toolkit'

const poolSlice = createSlice({
    name: 'pool',
    initialState: {
        allPool: {},
        markList: [],
    },
    reducers: {
        putAllPools: (state, action) => {
            const data = {};
            for (const actionElement of action.payload) {
                data[actionElement?.id] = {
                    ...data[actionElement?.id],
                    ...actionElement,
                };
            }
            console.error(data)
            state.allPool = data;
        },
        putPools: (state, action) => {
            const data = {
                ...state.allPool
            }
            if (action.payload.id) data[action.payload.id] = {
                ...data[action.payload.id],
                ...action.payload,
            };
            state.allPool = data;
        },
        initMarkList: (state, action) => {
            state.markList = action.payload;
        },
        insertMarkList: (state, action) => {
            if (state.markList.find(value => value === action.payload)) return;
            state.markList = [...state.markList, action.payload];
        },
        deleteMarkList: (state, action) => {
            state.markList = state.markList.filter(value => value !== action.payload);
        }
    }
});

export const {
    putAllPools,
    putPools,
    initMarkList,
    insertMarkList,
    deleteMarkList,
} = poolSlice.actions;
export default poolSlice.reducer;