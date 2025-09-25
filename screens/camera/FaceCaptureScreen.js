// FaceCaptureScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function FaceCaptureScreen({ navigation, route }) {
  const { lrn, type, course, yearGraduated } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [facing, setFacing] = useState("front");
  const cameraRef = useRef(null);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Need Camera Permission</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.btnText}>Grant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    const resized = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    setPhotoUri(resized.uri);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {photoUri ? (
        <View style={styles.previewBox}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("ValidIDCapture", { lrn, type, course, yearGraduated, faceUri: photoUri })
            }
          >
            <Text style={styles.btnText}>Use This Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.btnText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CameraView style={{ flex: 1 }} ref={cameraRef} facing={facing} />
          <View style={styles.overlay}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#6c757d" }]}
              onPress={() =>
                setFacing((prev) => (prev === "front" ? "back" : "front"))
              }
            >
              <Text style={styles.btnText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.btnText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
  },
  backText: { color: "#fff", fontSize: 16 },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    margin: 10,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  previewBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: { width: "90%", height: "70%", borderRadius: 12 },
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
});
