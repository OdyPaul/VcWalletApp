import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "./authService";
import { getAvatar } from "../photo/avatarSlice";

// -----------------------------------------------------------------------------
// Load user from AsyncStorage on app start
// -----------------------------------------------------------------------------
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    try {
      // 1️⃣ Try to load from local storage first (fast path)
      const localUser = await AsyncStorage.getItem("user");
      if (localUser) {
        return JSON.parse(localUser);
      }

      // 2️⃣ Otherwise, try from backend using saved token
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const user = await authService.getUser(token);

        // handle possible backend shapes: { user: {...} } or {...}
        const parsedUser = user?.user ? user.user : user;

        if (parsedUser) {
          await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
          return parsedUser;
        }
      }

      // 3️⃣ No user found anywhere
      return null;
    } catch (error) {
      console.error("❌ loadUser error:", error);
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// -----------------------------------------------------------------------------
// Register
// -----------------------------------------------------------------------------
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// -----------------------------------------------------------------------------
// Login
// -----------------------------------------------------------------------------
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// -----------------------------------------------------------------------------
// Logout
// -----------------------------------------------------------------------------
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// -----------------------------------------------------------------------------
// ✅ Update DID (wallet address)
// -----------------------------------------------------------------------------
export const updateUserDID = createAsyncThunk(
  "auth/updateUserDID",
  async ({ userId, walletAddress, token }, thunkAPI) => {
    try {
      const updated = await authService.updateUserDID(userId, walletAddress, token);
      return updated.user; // backend returns { message, user }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------
const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// -----------------------------------------------------------------------------
// Slice
// -----------------------------------------------------------------------------
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    // ✅ Allow manual user updates (for DID sync, etc.)
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      // ✅ Update DID
      .addCase(updateUserDID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserDID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Replace user with updated one
      })
      .addCase(updateUserDID.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, updateUser } = authSlice.actions;
export default authSlice.reducer;

// -----------------------------------------------------------------------------
// Optional: Extra actions on success
// -----------------------------------------------------------------------------
export const authExtraActions = (dispatch) => {
  return {
    onLoginSuccess: (user) => {
      dispatch(getAvatar());
    },
  };
};
