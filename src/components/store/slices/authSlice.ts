// /store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  // 其他认证相关状态...
}

const initialState: AuthState = {
  isAuthenticated: false,
  // 初始化其他状态...
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 你的 reducers...
  },
});

export default authSlice.reducer;
