// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import photoReducer from '../features/photo/photoSlice';
import avatarReducer from '../features/photo/avatarSlice'
import settingsReducer from '../features/settings/settingsSlice'
import verificationReducer from "../features/verification/verificationSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    photo: photoReducer,
    avatar: avatarReducer,
    settings: settingsReducer,
    verification: verificationReducer,
 
  },
});
