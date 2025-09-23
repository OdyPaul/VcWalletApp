import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import ProfilePhotoModal from '../components/modals/ProfilePhotoModal';
import { API_URL } from '../config';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function PersonalInfoScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const isFocused = useIsFocused();

  const user = useSelector(state => state.auth.user); // get user from Redux
  const token = user?.token;

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      Alert.alert('Session expired', 'You need to log in again.');
      navigation.replace('Login');
    }
  }, [token]);

  // Fetch latest photo when screen is focused
  useEffect(() => {
    if (isFocused && token) {
      fetchPhoto();
    }
  }, [isFocused, token]);

  const fetchPhoto = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length > 0) {
        const last = res.data[res.data.length - 1];
        setPhoto(`data:${last.contentType};base64,${arrayBufferToBase64(last.data.data)}`);
      } else {
        setPhoto(null);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const sub = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, sub);
    }
    return btoa(binary);
  };

  // Modal handlers
  const takePhoto = () => {
    setModalVisible(false);
    navigation.navigate('Camera', { token }); // navigate to CameraScreen with token
  };

  const pickFromGallery = async () => {
    setModalVisible(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('photo', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const res = await axios.post(`${API_URL}/api/photos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        Alert.alert('Success', 'Photo uploaded!');
        fetchPhoto(); // refresh displayed photo
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setModalVisible(false);
    // optionally call backend API to delete
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text>No Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <ProfilePhotoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTakePhoto={takePhoto}
        onPickGallery={pickFromGallery}
        onRemove={removePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  placeholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
});
