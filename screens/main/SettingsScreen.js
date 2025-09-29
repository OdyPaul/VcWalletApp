// file: screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from "../../config";
import { light, dark } from '../../theme/color';
import ProfilePhotoModal from '../../components/modals/ProfilePhotoModal';
import { toggleDarkMode } from '../../features/settings/settingsSlice';
import { logout } from '../../features/auth/authSlice';
import { clearAvatar } from "../../features/photo/avatarSlice";
import ConfirmVerifyModal from "../../components/modals/VerifyProfileModal";
import VerifyFirstModal from "../../components/modals/VerifyFirstModal";

import {
  getAvatar,
  uploadAvatar,
  deleteAvatar,
  setPreview,
} from '../../features/photo/avatarSlice';
import authService from '../../features/auth/authService';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log(user.verified)
  const { avatar, previewUri } = useSelector((state) => state.avatar);
  const darkMode = useSelector((state) => state.settings.darkMode);
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [faceIDEnabled, setFaceIDEnabled] = useState(true);

  const colors = darkMode ? dark : light;
  const displayUri = previewUri || avatar?.uri;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [verifyFirstVisible, setVerifyFirstVisible] = useState(false);
  // 🔄 Fetch avatar when screen is focused
  useEffect(() => {
    if (isFocused) dispatch(getAvatar());
  }, [isFocused, dispatch]);

  // 📷 Take photo (navigate to custom camera screen)
  const takePhoto = () => {
    setModalVisible(false);
    navigation.navigate('AvatarCamera');
  };


const pickFromGallery = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    const uploadAsset = {
      uri: asset.uri,
      fileName: asset.fileName || 'avatar.jpg',
      type: asset.mimeType ?? 'image/jpeg', // ✅ safer than asset.type
    };

    dispatch(setPreview(uploadAsset.uri));
    await dispatch(uploadAvatar(uploadAsset)).unwrap();

    Alert.alert("✅ Success", "Avatar uploaded");
    setModalVisible(false);
  } catch (err) {
    console.error("❌ Upload error:", err);
    Alert.alert("Upload failed", err.message || "Unknown error");
  }
};




  // ❌ Remove avatar
  const removePhoto = async () => {
    setModalVisible(false);
    try {
      if (avatar?._id) {
        await dispatch(deleteAvatar(avatar._id)).unwrap();
        Alert.alert('Removed', 'Your avatar has been removed.');
      } else {
        Alert.alert('No avatar', 'You don’t have an avatar to remove.');
      }
    } catch (err) {
      console.error('Delete avatar error:', err);
      Alert.alert('Error', err.message || 'Failed to remove avatar');
    }
  };

const handleVerifyAccount = () => {
  setConfirmVisible(true);
};

const confirmVerification = () => {
  setConfirmVisible(false);
  navigation.navigate("VerifyAccount");
};

  // 🚪 Logout
const handleLogout = async () => {
  try {
    await authService.logout(); // clears AsyncStorage
    dispatch(logout());         // clears Redux auth slice
    dispatch(clearAvatar());    // ✅ clears Redux avatar slice
    Alert.alert("Logout", "You have been logged out.");
    // Navigation auto-handled in AppNavigation when user = null
  } catch (err) {
    console.error("Logout failed", err);
    Alert.alert("Error", "Failed to logout.");
  }
};

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* 👤 Header with avatar */}
      <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={styles.avatar}
            onError={() => {
              console.warn("❌ Failed to load avatar, clearing local state");
              dispatch({ type: "avatar/clearAvatar" }); // simple action to reset state
            }}
          />


          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Ionicons name="person-outline" size={40} color={colors.sub} />
            </View>
          )}
        </TouchableOpacity>

          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.name || 'John Doe'}
            </Text>
            <Text style={[styles.username, { color: colors.sub }]}>
              @{user?.username || 'johndoe'}
            </Text>

            {user?.verified === "verified" ? (
              <View style={[styles.verifiedBadge, { backgroundColor: "green" }]}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.verifiedBadge, { backgroundColor: "red" }]}
                onPress={handleVerifyAccount}
              >
                <Ionicons name="close-circle" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Unverified</Text>
              </TouchableOpacity>
            )}


          </View>
          </View>



      {/* ⚙️ Account details */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>
          Account details
        </Text>

          {user?.verified === "verified" ? (
            // ✅ Verified → go to profile info
            <TouchableOpacity
              style={[styles.option, { borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate("PersonalInfo")}
            >
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>
                Profile
              </Text>
            </TouchableOpacity>
          ) : (
            // ❌ Unverified → trigger verify flow
              <TouchableOpacity
                style={[styles.option, { borderBottomColor: colors.border }]}
                onPress={() => setVerifyFirstVisible(true)} // 👈 open new modal
              >
                <Ionicons name="person-outline" size={20} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>
                  Profile
                </Text>
              </TouchableOpacity>
          )}



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
          <Switch
            style={{ marginLeft: 'auto' }}
            value={faceIDEnabled}
            onValueChange={setFaceIDEnabled}
          />
        </View>

        <View style={styles.option}>
          <Ionicons name="moon-outline" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            style={{ marginLeft: 'auto' }}
            value={darkMode}
            onValueChange={() => dispatch(toggleDarkMode())}
          />
        </View>
      </View>

      {/* ❓ Help & Support */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>
          Help and Support
        </Text>

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

      {/* 📸 Photo Modal */}
      <ProfilePhotoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTakePhoto={takePhoto}
        onPickGallery={pickFromGallery}
        onRemove={removePhoto}
      />

        <ConfirmVerifyModal
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmVerification}
      />

  <VerifyFirstModal
  visible={verifyFirstVisible}
  onClose={() => setVerifyFirstVisible(false)}
  onVerify={() => {
    setVerifyFirstVisible(false);
    navigation.navigate("VerifyAccount");
  }}/>
    </ScrollView>
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
    marginTop: 15,
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
