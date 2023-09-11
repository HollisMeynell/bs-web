import {createSlice} from '@reduxjs/toolkit';

function getDefaultTheme() {
    const data = window.localStorage.getItem("THEME");
    if (data) return JSON.parse(data);
    return {
        dark: false,
        token: {
            colorPrimary: '#1d39c4',
        },
    }
}

function saveTheme(t) {
    if (typeof t === 'string') {
        window.localStorage.setItem("THEME", t);
    } else {
        window.localStorage.setItem("THEME", JSON.stringify(t));
    }
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: getDefaultTheme(),
    },
    reducers: {
        setColor: (state, action) => {
            if (!state.value.token) state.value.token = {};
            state.value.token.colorPrimary = action.payload;
            saveTheme(state.value);
        },
        setTheme: (state, action) => {
            state.value = action.payload;
            saveTheme(action.payload);
        },
        setDark: (state) => {
            state.value.dark = true;
            saveTheme(state.value);
        },
        setLight: (state) => {
            state.value.dark = false;
            saveTheme(state.value);
        },
        changeDark: (state) => {
            state.value.dark = !state.value.dark;
            saveTheme(state.value);
        },
    }
})

export const {setColor, setTheme, setLight, setDark, changeDark} = themeSlice.actions;
export default themeSlice.reducer;