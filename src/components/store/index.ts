import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // reducers...
  },
});

// 从 store 本身推断 `RootState` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断 dispatch 类型
export type AppDispatch = typeof store.dispatch;