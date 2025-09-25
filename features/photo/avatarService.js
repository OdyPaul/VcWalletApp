// avatarService.js
import axios from 'axios';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔑 Get stored user
const getStoredUser = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

// 🔑 Get token from storage
const getAuthToken = async () => {
  const user = await getStoredUser();
  return user?.token || null;
};

// 🔑 Build key based on user ID
const getAvatarKey = async () => {
  const user = await getStoredUser();
  if (!user?._id) return null;
  return `avatar_${user._id}`; // unique per account
};

// Save avatar locally for current user
const saveAvatarLocally = async (avatar) => {
  const key = await getAvatarKey();
  if (!key) return;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(avatar));
  } catch (err) {
    console.error('Failed to save avatar locally:', err);
  }
};

// Get avatar (local-first, fallback to backend)
const getAvatar = async () => {
  const key = await getAvatarKey();
  if (!key) return null;

  // 1. Try local first
  const local = await AsyncStorage.getItem(key);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      await AsyncStorage.removeItem(key); // corrupted cache
    }
  }

  // 2. Fetch from backend
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`${API_URL}/api/avatar`, config);

    const avatar = res.data;
    if (!avatar?._id) return null;

    const avatarData = {
      _id: avatar._id,
      filename: avatar.filename,
      contentType: avatar.contentType,
      uri: avatar.uri,
    };

    await saveAvatarLocally(avatarData);
    return avatarData;
  } catch (err) {
    console.error('Failed to fetch avatar:', err.response?.data || err.message);
    return null;
  }
};

// Delete avatar
const deleteAvatar = async (id) => {
  const token = await getAuthToken();
  const key = await getAvatarKey();
  if (!token || !key) return null;

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.delete(`${API_URL}/api/avatar/${id}`, config);

    await AsyncStorage.removeItem(key);
    return res.data;
  } catch (err) {
    console.error('Failed to delete avatar:', err.response?.data || err.message);
    throw err;
  }
};

// Upload avatar (Expo Go compatible)
const uploadAvatar = async (asset) => {
  const token = await getAuthToken();
  const key = await getAvatarKey();
  if (!token || !key) throw new Error('No token or user ID found');

  if (!asset || !asset.uri) {
    throw new Error('Invalid asset: missing uri');
  }

  const uri = asset.uri.startsWith('file://') ? asset.uri : `file://${asset.uri}`;
  const formData = new FormData();
  formData.append('photo', {
    uri,
    type: 'image/jpeg',
    name: asset.fileName || 'avatar.jpg',
  });

  try {
    const response = await fetch(`${API_URL}/api/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    const avatar = await response.json();

    const avatarData = {
      _id: avatar._id,
      filename: avatar.filename,
      contentType: avatar.contentType,
      uri: `${API_URL}/api/avatar/${avatar._id}`, // always absolute URL
    };

    await saveAvatarLocally(avatarData);
    return avatarData;
  } catch (err) {
    console.error('Avatar upload error:', err.message || err);
    throw err;
  }
};


export default {
  getAvatar,
  uploadAvatar,
  deleteAvatar,
  saveAvatarLocally,
};
