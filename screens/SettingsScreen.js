import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useIsFocused } from '@react-navigation/native';
import ProfilePhotoModal from '../components/modals/ProfilePhotoModal';
import { API_URL } from '../config';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = user?.token;

  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Light mode default
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && token) fetchPhoto();
  }, [isFocused, token]);

  const fetchPhoto = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) {
        const last = res.data[res.data.length - 1];
        setPhoto(`data:${last.contentType};base64,${arrayBufferToBase64(last.data.data)}`);
      } else setPhoto(null);
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

  const takePhoto = () => {
    setModalVisible(false);
    navigation.navigate('Camera', { token });
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
        fetchPhoto();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    dispatch(logout());
  };

  // Theme colors
  const colors = darkMode
    ? { bg: '#111', card: '#1c1c1e', text: '#fff', sub: '#aaa', border: '#333' }
    : { bg: '#fff', card: '#f9f9f9', text: '#111', sub: '#555', border: '#ddd' };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder, { backgroundColor: colors.border }]}>
              <Ionicons name="person-outline" size={40} color={colors.sub} />
            </View>
          )}
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'John Doe'}</Text>
          <Text style={[styles.username, { color: colors.sub }]}>@{user?.username || 'johndoe'}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#fff" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
      </View>

      {/* Account Details */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>Account details</Text>

        <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Personal Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]}>
          <Ionicons name="trophy-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Level Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]}>
          <Ionicons name="people-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Referral Friend</Text>
        </TouchableOpacity>

        <View style={[styles.option, { borderBottomColor: colors.border }]}>
          <Ionicons name="finger-print-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Set up Face ID</Text>
          <Switch style={{ marginLeft: 'auto' }} value={faceIDEnabled} onValueChange={setFaceIDEnabled} />
        </View>

        <View style={styles.option}>
          <Ionicons name="moon-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Dark Mode</Text>
          <Switch style={{ marginLeft: 'auto' }} value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      {/* Help & Support */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>Help and Support</Text>

        <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]}>
          <Ionicons name="help-circle-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Help Center</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={[styles.optionText, { color: 'red' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Modal */}
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
  container: { flex: 1, padding: 16 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  username: { fontSize: 14 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a84ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  verifiedText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  section: { marginBottom: 20, borderRadius: 12 },
  sectionTitle: { fontSize: 14, margin: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { marginLeft: 12, fontSize: 16 },
});
