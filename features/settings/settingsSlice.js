// features/settings/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = settingsSlice.actions; // ✅ must export
export default settingsSlice.reducer;
