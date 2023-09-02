import {createSlice} from '@reduxjs/toolkit';

export const errorSlice = createSlice({
    name: "errorHandle",
    initialState: {
        message: "",
        error: void 0,
    },
    reducers: {
        setError: (state, action) => {

        }
    }

})