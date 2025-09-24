import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import photoService from './photoService';

const initialState = {
  photos: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Upload photo
export const uploadPhoto = createAsyncThunk(
  'photo/upload',
  async (photoData, thunkAPI) => {
    try {
      return await photoService.uploadPhoto(photoData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch photos
export const getPhotos = createAsyncThunk(
  'photo/getAll',
  async (_, thunkAPI) => {
    try {
      return await photoService.getPhotos();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete photo
export const deletePhoto = createAsyncThunk(
  'photo/delete',
  async (id, thunkAPI) => {
    try {
      return await photoService.deletePhoto(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadPhoto.pending, (state) => { state.isLoading = true; })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.photos.push(action.payload);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Photos
      .addCase(getPhotos.pending, (state) => { state.isLoading = true; })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.photos = action.payload;
      })
      .addCase(getPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Photo
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter((photo) => photo._id !== action.payload.id);
      });
  },
});

export const { reset } = photoSlice.actions;
export default photoSlice.reducer;
