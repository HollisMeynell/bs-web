import { configureStore } from '@reduxjs/toolkit';
import theme from "./store/theme.js";
import pool from "./store/pool.js";
import show from "@/components/store/show.js";
export default configureStore({
    reducer: {
        theme: theme,
        pool: pool,
        show: show,
    },
});