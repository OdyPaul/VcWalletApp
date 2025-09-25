// file: screens/AvatarCameraScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useDispatch } from "react-redux";
import { uploadAvatar, setPreview } from "../../features/photo/avatarSlice";
import * as ImageManipulator from 'expo-image-manipulator';

export default function AvatarCameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("front"); // "front" | "back"
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", marginBottom: 12 }}>
          We need camera permissions
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007bff" }]}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6c757d", marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📸 Take photo
 
const takePhoto = async () => {
  if (!cameraRef.current) return;

  try {
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });

    if (!photo?.uri) {
      Alert.alert("Error", "No photo URI captured");
      return;
    }

    const resized = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    setPhotoUri(resized.uri);
    dispatch(setPreview(resized.uri));
  } catch (err) {
    console.error("Camera error:", err);
    Alert.alert("Camera error", err.message || "Failed to capture photo");
  }
};


  // ✅ Confirm and upload avatar
  const confirmAvatar = async () => {
  if (!photoUri) return;

  try {
    await dispatch(uploadAvatar({ uri: photoUri, type: "image/jpeg", name: "avatar.jpg" })).unwrap();
    Alert.alert("Success", "Avatar updated!");
    navigation.goBack();
  } catch (err) {
    console.error("Upload error:", err);
    Alert.alert("Error", err.message || "Failed to upload avatar");
  }
};


  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#dc3545" }]}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#28a745" }]}
              onPress={confirmAvatar}
            >
              <Text style={styles.buttonText}>Use Avatar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6c757d", marginTop: 15 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          <View style={styles.buttonOverlay}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                setFacing(facing === "back" ? "front" : "back")
              }
            >
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#6c757d" }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  buttonOverlay: {
    position: "absolute",
    bottom: 64,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: { padding: 12, backgroundColor: "#00000088", borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: { width: "90%", height: "70%", borderRadius: 12 },
  actionRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "70%",
    justifyContent: "space-between",
  },
});
