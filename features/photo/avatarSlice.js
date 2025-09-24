// features/photo/avatarSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import avatarService from './avatarService';

const initialState = {
  avatar: null,       // backend avatar object or local
  previewUri: null,   // local preview while uploading
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Upload or replace avatar
export const uploadAvatar = createAsyncThunk(
  'avatar/upload',
  async (photoData, thunkAPI) => {
    try {
      return await avatarService.uploadAvatar(photoData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch avatar (tries local first, then backend)
export const getAvatar = createAsyncThunk(
  'avatar/get',
  async (_, thunkAPI) => {
    try {
      const avatar = await avatarService.getAvatar();
      return avatar;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete avatar
export const deleteAvatar = createAsyncThunk(
  'avatar/delete',
  async (id, thunkAPI) => {
    try {
      return await avatarService.deleteAvatar(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.previewUri = null;
    },
    setPreview: (state, action) => {
      state.previewUri = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadAvatar.pending, (state, action) => {
        state.isLoading = true;

        // auto-set preview from FormData
        if (action.meta.arg?._parts) {
          const uriPart = action.meta.arg._parts.find(p => p[0] === 'photo');
          if (uriPart?.[1]?.uri) state.previewUri = uriPart[1].uri;
        }
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.avatar = action.payload;
        // previewUri remains for immediate UI
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Fetch
      .addCase(getAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.avatar = action.payload;
      })
      .addCase(getAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Delete
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.avatar = null;
        state.previewUri = null;
      });
  },
});

export const { reset, setPreview } = avatarSlice.actions;
export default avatarSlice.reducer;
