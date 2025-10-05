import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

// -----------------------------------------------------------------------------
// Register
// -----------------------------------------------------------------------------
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/mobile/users`, userData);
  if (response.data) {
    await AsyncStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// -----------------------------------------------------------------------------
// Login
// -----------------------------------------------------------------------------
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/mobile/users/login`, userData);

    if (response.data) {
      const user = response.data;

      // ✅ Save token separately (if exists)
      if (user?.token) {
        await AsyncStorage.setItem("token", user.token);
      }

      // ✅ Always store the full user object
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return user;
    }

    return null;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again.";
    throw new Error(message);
  }
};


// -----------------------------------------------------------------------------
// Logout
// -----------------------------------------------------------------------------
const logout = async () => {
  try {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.error("Error clearing storage on logout:", error);
  }
};
// -----------------------------------------------------------------------------
// Get user from AsyncStorage
// -----------------------------------------------------------------------------
const getUser = async (token) => {
  try {
    // 1️⃣ Try local user first
    const localUser = await AsyncStorage.getItem("user");
    if (localUser) {
      return JSON.parse(localUser);
    }

    // 2️⃣ If no local user, fetch from backend
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/api/mobile/me`, config);

      if (data?.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        return data.user;
      }

      // if backend returns user directly, not wrapped
      if (data) {
        await AsyncStorage.setItem("user", JSON.stringify(data));
        return data;
      }
    }

    // 3️⃣ Fallback
    return null;
  } catch (error) {
    console.error("❌ getUser error:", error);
    return null;
  }
};



// -----------------------------------------------------------------------------
// 🪪 Update user DID (wallet address)
// -----------------------------------------------------------------------------
const updateUserDID = async (userId, walletAddress, token) => {
  if (!token) throw new Error("Missing auth token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const { data } = await axios.put(
    `${API_URL}/api/mobile/${userId}/did`,
    { walletAddress },
    config
  );

  // ✅ Persist updated user
  if (data?.user) {
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
  }

  return data; // { message, user }
};

export default { register, login, logout, getUser, updateUserDID };
