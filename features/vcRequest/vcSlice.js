import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vcService from './vcService';
import axios from "axios";             // ✅ add this
import { API_URL } from "../../config"; // ✅ add this

const initialState = {
  request: null,
  requests: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const createVCRequest = createAsyncThunk(
  "vc/create",
  async (vcData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.post(`${API_URL}/api/vc-requests`, vcData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);



const vcSlice = createSlice({
  name: 'vc',
  initialState,
  reducers: { reset: (state) => Object.assign(state, initialState) },
  extraReducers: (builder) => {
    builder
      .addCase(createVCRequest.pending, (state) => { state.isLoading = true; })
      .addCase(createVCRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.request = action.payload;
        state.requests.push(action.payload);
      })
      .addCase(createVCRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = vcSlice.actions;
export default vcSlice.reducer;
