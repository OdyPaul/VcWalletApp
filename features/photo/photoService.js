import axios from 'axios';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Convert ArrayBuffer -> Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // avoid call stack overflow
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return global.btoa(binary);
};

// Upload photo
const uploadPhoto = async (photoData) => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(`${API_URL}/api/photos`, photoData, config);
  return response.data;
};

// Get all photos
const getPhotos = async () => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
    responseType: 'json',
  };

  const response = await axios.get(`${API_URL}/api/photos`, config);

  // Transform each photo to base64 string
  return response.data.map((p) => ({
    _id: p._id,
    filename: p.filename,
    contentType: p.contentType,
    uri: `data:${p.contentType};base64,${arrayBufferToBase64(p.data.data)}`, // <-- usable in <Image />
  }));
};

// Delete photo
const deletePhoto = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  };

  const response = await axios.delete(`${API_URL}/api/photos/${id}`, config);
  return response.data;
};

export default { uploadPhoto, getPhotos, deletePhoto };
