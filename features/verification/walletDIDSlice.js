// src/features/verification/walletDID.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import walletDIDService from "./walletDIDService";

// 🔄 Async thunk to update DID
export const updateWalletDID = createAsyncThunk(
  "walletDID/update",
  async ({ userId, walletAddress, token }, thunkAPI) => {
    try {
      return await walletDIDService.updateWalletDID(userId, walletAddress, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const walletDIDSlice = createSlice({
  name: "walletDID",
  initialState: {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetDIDState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateWalletDID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWalletDID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateWalletDID.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDIDState } = walletDIDSlice.actions;
export default walletDIDSlice.reducer;
