import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: 'show',
    initialState: {
        message: {},
        delMessageKey: '',
        notification: {},
    },
    reducers: {
        putMessage: (state, action) => {
            state.message = action.payload;
        },
        popMessage: state => {
            state.message = {};
        },
        delMessage: (state, action) => {
            state.delMessageKey = action.payload;
        },
        delMessageDone: state => {
            state.delMessageKey = '';
        },
    }
})

export const {
    putMessage,
    popMessage,
    delMessage,
    delMessageDone,
} = messageSlice.actions;

export default messageSlice.reducer;