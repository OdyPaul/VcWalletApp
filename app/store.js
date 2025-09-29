// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import photoReducer from '../features/photo/photoSlice';
import avatarReducer from '../features/photo/avatarSlice'
import settingsReducer from '../features/settings/settingsSlice'
import vcReducer from "../features/vcRequest/vcSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    photo: photoReducer,
    avatar: avatarReducer,
    settings: settingsReducer,
    vc: vcReducer,
  },
});
