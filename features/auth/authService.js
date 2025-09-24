// authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users`, userData);
  if (response.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/login`, userData);
  if (response.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
  await AsyncStorage.removeItem('user');
};

const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default { register, login, logout, getUser };
