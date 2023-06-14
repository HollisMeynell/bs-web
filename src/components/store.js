import { configureStore } from '@reduxjs/toolkit';
import theme from "./store/theme.js";
export default configureStore({
    reducer: {
        theme: theme,
    },
});