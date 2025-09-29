import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useSelector } from "react-redux";
import { API_URL } from "../../config";

export default function ValidIDCaptureScreen({ navigation, route }) {
  const { lrn, type, course, yearGraduated, faceUri } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const cameraRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

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
  const handleCancel = () => {
    // Close modal if it’s open
    setShowConfirm(false);

    // Navigate back to Home screen
    navigation.navigate("MainTabs");
  };
  const takePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    const resized = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    setPhotoUri(resized.uri);
  };

const submitVCRequest = async () => {
    try {
    // 🔎 Check if the user already has a pending request for this type
    const checkRes = await fetch(`${API_URL}/api/mobile/vc-request/mine`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    if (!checkRes.ok) {
      throw new Error("Failed to check existing requests");
    }

    const existingRequests = await checkRes.json();
    const hasPending = existingRequests.some(
      (req) => req.type === type && req.status === "pending"
    );

    if (hasPending) {
      Alert.alert(
        "Duplicate Request",
        `You already have a pending ${type} request. Please wait for it to be reviewed before submitting another.`
      );
      return;
    }
  
    const formData = new FormData();
    formData.append("lrn", lrn);
    formData.append("type", type);
    formData.append("course", course);
    formData.append("yearGraduated", yearGraduated || "");

    if (faceUri) {
      formData.append("faceImage", {
        uri: faceUri,
        type: "image/jpeg",
        name: "face.jpg",
      });
    }
    if (photoUri) {
      formData.append("validIdImage", {
        uri: photoUri,
        type: "image/jpeg",
        name: "valid_id.jpg",
      });
    }

    const res = await fetch(`${API_URL}/api/mobile/vc-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "VC request failed");
    }

    const vcRequest = await res.json();
    console.log("VCRequest created:", vcRequest);

    Alert.alert("Success", "VC Request submitted!");
    navigation.navigate("MainTabs");
  } catch (err) {
    Alert.alert("Error", err.message);
  }
};



  return (
    <View style={styles.container}>
      {/* Back button */}
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
            onPress={() => setShowConfirm(true)}
          >
            <Text style={styles.btnText}>Proceed to Confirmation</Text>
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
          <CameraView style={{ flex: 1 }} ref={cameraRef} />
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.btnText}>Capture ID</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Confirm VC Request</Text>
              <Text>Type: {type}</Text>
              <Text>Course: {course}</Text>
              <Text>Year: {yearGraduated}</Text>

              <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                Uploaded Images:
              </Text>

              {/* Face Preview */}
              <Text>Face Photo:</Text>
              <Image source={{ uri: faceUri }} style={styles.modalPreview} />
              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: "red" }]}
                onPress={() => {
                  setShowConfirm(false);
                  navigation.navigate("FaceCapture", { lrn, type, course, yearGraduated });

                }}
              >
                <Text style={styles.btnText}>Retake Face</Text>
              </TouchableOpacity>

              {/* ID Preview */}
              <Text>Valid ID:</Text>
              <Image source={{ uri: photoUri }} style={styles.modalPreview} />
              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: "red" }]}
                onPress={() => {
                  setShowConfirm(false);
                  setPhotoUri(null);
                }}
              >
                <Text style={styles.btnText}>Retake ID</Text>
              </TouchableOpacity>

              {/* Submit */}
              <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={submitVCRequest}
              >
                <Text style={styles.btnText}>Confirm & Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "gray" }]}
                onPress={handleCancel}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#28a745",
    margin: 10,
    borderRadius: 8,
  },
  smallBtn: {
    padding: 8,
    backgroundColor: "#007bff",
    marginVertical: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  previewBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: { width: "90%", height: "70%", borderRadius: 12 },
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 5,
  },
});
