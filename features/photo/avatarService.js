// avatarService.js
import axios from 'axios';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = 'avatar';

// Get stored user token
const getAuthToken = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

// Save avatar locally
const saveAvatarLocally = async (avatar) => {
  try {
    await AsyncStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
  } catch (err) {
    console.error('Failed to save avatar locally:', err);
  }
};

// Get avatar from local storage first, then API
const getAvatar = async () => {
  // Check local storage first
  const local = await AsyncStorage.getItem(AVATAR_KEY);
  if (local) return JSON.parse(local);

  // Otherwise, fetch from API
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`${API_URL}/api/avatar`, config);
    const avatar = res.data || null;

    if (avatar) await saveAvatarLocally(avatar);
    return avatar;
  } catch (err) {
    console.error('Failed to fetch avatar:', err.response?.data || err.message);
    return null;
  }
};

// Delete avatar from server and local storage
const deleteAvatar = async (id) => {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.delete(`${API_URL}/api/avatar/${id}`, config);
    await AsyncStorage.removeItem(AVATAR_KEY); // remove local copy
    return res.data;
  } catch (err) {
    console.error('Failed to delete avatar:', err.response?.data || err.message);
    throw err;
  }
};

// Upload avatar to server and save locally
const uploadAvatar = async (photoData) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No token found');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const res = await axios.post(`${API_URL}/api/avatar`, photoData, config);
    const avatar = res.data;

    if (!avatar?._id) throw new Error('Upload failed: no avatar ID returned');

    const avatarData = {
      _id: avatar._id,
      filename: avatar.filename,
      contentType: avatar.contentType,
      uri: avatar.filename ? `${API_URL}/api/avatar/${avatar._id}` : null,
    };

    await saveAvatarLocally(avatarData);
    return avatarData;
  } catch (err) {
    console.error('Avatar upload error:', err.response?.data || err.message);
    throw err;
  }
};

export default { getAvatar, uploadAvatar, deleteAvatar, saveAvatarLocally };
