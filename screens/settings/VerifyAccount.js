// VerifyAccount.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Picker } from "@react-native-picker/picker";
import { s, vs } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { uploadSelfie, uploadId } from "../../features/photo/photoSlice";
import { createVCRequest } from "../../features/vcRequest/vcSlice";


export default function VerifyAccount() {
    const dispatch = useDispatch();
// For VC request state (final submission)
    const { isLoading: vcLoading, isError: vcError, message: vcMessage } = useSelector(
    (state) => state.vc
    );
    
    const { user } = useSelector((state) => state.auth);
    console.log("Current user:", user);
    // For photo uploads (selfie & ID)
    const { isLoading: photoLoading, isError: photoError, message: photoMessage } = useSelector(
    (state) => state.photo
    );


  const [step, setStep] = useState(1);
    const navigation = useNavigation();  
  // Step 1 – Personal info
  const [personal, setPersonal] = useState({
    fullName: "",
    address: "",
    birthPlace: "",
    birthDate: "",
  });

  // Step 2 – Education
  const [education, setEducation] = useState({
    highSchool: "",
    admissionDate: "",
    graduationDate: "",
  });

  // Step 3 – Selfie
  const [selfieUri, setSelfieUri] = useState(null);

  // Step 4 – ID
  const [idUri, setIdUri] = useState(null);
  const [idType, setIdType] = useState("");

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("front");

  // Final confirmation
  const [showConfirm, setShowConfirm] = useState(false);




 const handleSubmit = async () => {
  try {

    let selfieRes;
    if (selfieUri) {
      selfieRes = await dispatch(uploadSelfie({
        uri: selfieUri,
        name: "selfie.jpg",
        type: "image/jpeg",
      })).unwrap();
    }

    // Upload ID
    let idRes;
    if (idUri) {
      idRes = await dispatch(uploadId({
        uri: idUri,
        name: "id.jpg",
        type: "image/jpeg",
      })).unwrap();
    }

    // Submit verification request
    await dispatch(createVCRequest({
      personal,
      education,
      selfieImageId: selfieRes?.id || selfieRes?._id || null,
      idImageId: idRes?.id || idRes?._id || null,
    })).unwrap();

    alert("✅ Verification submitted successfully!");
    setShowConfirm(false);
    navigation.navigate("MainTabs", { screen: "Settings" });
  } catch (err) {
    console.error(err);
    alert("❌ Submission failed, please try again.");
  }
};


  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.centerContent}>
        <Text style={{ color: "#000" }}>Need Camera Permission</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.btnText}>Grant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async (setter) => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setter(resized.uri);
      setShowCamera(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Step Header */}
    <View style={styles.header}>
        <Text style={styles.stepText}>Step {step} of 4</Text>
        <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{step}</Text>
        </View>
    </View>
      {/* Back button directly under the header */}
    {step > 1 && (
        <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setStep(step - 1)}
        >
        <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
    )}


      {/* Step 1 – Personal Info */}
      {step === 1 && (
        <View style={[styles.form, styles.centerContent]}>
                {/* X Button */}
        <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.navigate("MainTabs", { screen: "Settings" })}
        >
            <Ionicons name="close-circle" size={28} color="red" />
        </TouchableOpacity>
          <Text style={styles.title}>Personal Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={personal.fullName}
            onChangeText={(t) => setPersonal({ ...personal, fullName: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={personal.address}
            onChangeText={(t) => setPersonal({ ...personal, address: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Place of Birth"
            value={personal.birthPlace}
            onChangeText={(t) => setPersonal({ ...personal, birthPlace: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={personal.birthDate}
            onChangeText={(t) => setPersonal({ ...personal, birthDate: t })}
          />
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 – Education */}
      {step === 2 && (
        <View style={[styles.form, styles.centerContent]}>

          <Text style={styles.title}>Education Information</Text>
          <TextInput
            style={styles.input}
            placeholder="High School"
            value={education.highSchool}
            onChangeText={(t) => setEducation({ ...education, highSchool: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Admission (ex. 2021-2022)"
            value={education.admissionDate}
            onChangeText={(t) =>
              setEducation({ ...education, admissionDate: t })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Date Graduated (ex. 2025)"
            value={education.graduationDate}
            onChangeText={(t) =>
              setEducation({ ...education, graduationDate: t })
            }
          />
          <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3 – Selfie */}
      {step === 3 && (
        
        <View style={{ flex: 1 }}>

          {!showCamera && !selfieUri ? (
            
            <View style={[styles.form, styles.centerContent]}>

              <Text style={styles.title}>Take a Selfie</Text>
              <Text
                style={{
                  marginBottom: vs(20),
                  color: "#555",
                  textAlign: "center",
                }}
              >
                Please make sure your face is clearly visible with good
                lighting.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowCamera(true)}
              >
                <Text style={styles.btnText}>Start Selfie</Text>
              </TouchableOpacity>

            </View>
          ) : selfieUri ? (
            <View style={styles.previewBox}>
              <Image source={{ uri: selfieUri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.button}
                onPress={() => setStep(4)}
              >
                <Text style={styles.btnText}>Use This Selfie</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => {
                  setSelfieUri(null);
                  setShowCamera(false);
                }}
              >
                <Text style={styles.btnText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <CameraView style={{ flex: 1 }} ref={cameraRef} facing={facing} />
              <TouchableOpacity
                style={[
                  styles.smallBtn,
                  { position: "absolute", top: vs(20), left: s(10) },
                ]}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.btnText}>← Back</Text>
              </TouchableOpacity>
              <View style={styles.overlay}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    setFacing((prev) =>
                      prev === "front" ? "back" : "front"
                    )
                  }
                >
                  <Text style={styles.btnText}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => takePhoto(setSelfieUri)}
                >
                  <Text style={styles.btnText}>Capture</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      {/* Step 4 – Valid ID */}
      {step === 4 && (
        <View style={{ flex: 1 }}>
          {!showCamera && !idUri ? (
            <View style={[styles.form, styles.centerContent]}>
              <Text style={styles.title}>Valid ID Information</Text>
              <Text style={{ marginBottom: vs(10), color: "#555" }}>
                Please select your ID type before capturing.
              </Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={idType}
                  onValueChange={(itemValue) => setIdType(itemValue)}
                >
                  <Picker.Item label="Select ID Type" value="" />
                  <Picker.Item label="PhilSys (National ID)" value="philsys" />
                  <Picker.Item label="Philippine Passport" value="passport" />
                  <Picker.Item
                    label="Driver’s License"
                    value="drivers_license"
                  />
                  <Picker.Item label="SSS UMID" value="sss_umid" />
                  <Picker.Item label="PhilHealth ID" value="philhealth" />
                  <Picker.Item label="TIN ID" value="tin" />
                  <Picker.Item label="Postal ID" value="postal" />
                  <Picker.Item label="Voter’s ID" value="voter" />
                  <Picker.Item label="PRC ID" value="prc" />
                  <Picker.Item label="GSIS ID" value="gsis" />
                </Picker>
              </View>
              <TouchableOpacity
                style={[styles.button, { opacity: idType ? 1 : 0.5 }]}
                disabled={!idType}
                onPress={() => setShowCamera(true)}
              >
                <Text style={styles.btnText}>Start Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, { marginTop: vs(10) }]}
                onPress={() => setStep(3)}
              >
                <Text style={styles.btnText}>← Back</Text>
              </TouchableOpacity>
            </View>
          ) : idUri ? (
            <View style={styles.previewBox}>
              <Image source={{ uri: idUri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowConfirm(true)}
              >
                <Text style={styles.btnText}>Use This ID</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => {
                  setIdUri(null);
                  setShowCamera(false);
                }}
              >
                <Text style={styles.btnText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <CameraView style={{ flex: 1 }} ref={cameraRef} />
              <TouchableOpacity
                style={[
                  styles.smallBtn,
                  { position: "absolute", top: vs(20), left: s(10) },
                ]}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.btnText}>← Back</Text>
              </TouchableOpacity>
              <View style={styles.overlay}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    !idType && { backgroundColor: "#ccc" },
                  ]}
                  disabled={!idType}
                  onPress={() => takePhoto(setIdUri)}
                >
                  <Text style={styles.btnText}>
                    {idType ? "Capture ID" : "Select ID Type First"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      {/* Final Confirmation Modal */}
     <Modal visible={showConfirm} animationType="slide">
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
    {/* Header with X button */}
    <View style={{ 
      flexDirection: "row", 
      justifyContent: "flex-end", 
      alignItems: "center", 
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd"
    }}>
      <TouchableOpacity onPress={() => setShowConfirm(false)}>
        <Text style={{ fontSize: 22, color: "red" }}>✕</Text>
      </TouchableOpacity>
    </View>

    {/* Scrollable Content */}
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Review Your Information</Text>
      <Text>Full Name: {personal.fullName}</Text>
      <Text>Address: {personal.address}</Text>
      <Text>Place of Birth: {personal.birthPlace}</Text>
      <Text>Date of Birth: {personal.birthDate}</Text>

      <Text style={{ marginTop: 10 }}>
        High School: {education.highSchool}
      </Text>
      <Text>Admission: {education.admissionDate}</Text>
      <Text>Graduation: {education.graduationDate}</Text>

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Selfie:</Text>
      {selfieUri && (
        <Image source={{ uri: selfieUri }} style={styles.modalPreview} />
      )}

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Valid ID:</Text>
      {idUri && (
        <Image source={{ uri: idUri }} style={styles.modalPreview} />
      )}
        <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleSubmit}
        disabled={vcLoading || photoLoading}
        >

            <Text style={styles.btnText}>
            {vcLoading || photoLoading ? "Submitting..." : "Confirm & Submit"}
            </Text>

        </TouchableOpacity>

    </ScrollView>
  </View>
</Modal>

    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    padding: s(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepText: { fontSize: s(14), color: "#6c757d" },
  stepCircle: {
    borderWidth: 2,
    borderColor: "#28a745",
    borderRadius: s(20),
    width: s(40),
    height: s(40),
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: { color: "#28a745", fontWeight: "bold" },

  // Form card
  form: {
    backgroundColor: "#fff",
    borderRadius: s(16),
    padding: s(20),
    marginHorizontal: s(16),
    marginVertical: vs(10),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    width: "90%",
  },
  title: {
    fontSize: s(18),
    fontWeight: "600",
    marginBottom: vs(15),
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: s(10),
    padding: s(12),
    marginBottom: vs(12),
    backgroundColor: "#fafafa",
  },

  // Buttons
  button: {
    backgroundColor: "#007bff",
    padding: vs(14),
    margin: vs(10),
    borderRadius: s(12),
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: s(16), fontWeight: "600" },
  smallBtn: {
    padding: vs(10),
    backgroundColor: "#6c757d",
    borderRadius: s(8),
    alignSelf: "flex-start",
  },

  // Camera
  previewBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: {
    width: "90%",
    height: "70%",
    borderRadius: s(12),
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  overlay: {
    position: "absolute",
    bottom: vs(40),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },

  // Modal
  modalPreview: {
    width: "100%",
    height: vs(200),
    borderRadius: s(10),
    marginVertical: vs(10),
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: s(10),
    marginBottom: vs(15),
    overflow: "hidden",
    backgroundColor: "#fafafa",
    width: "100%",
  },
  backBtn: {
  marginHorizontal: s(20),
  marginBottom: vs(5),
  alignSelf: "flex-start",
  backgroundColor: "#6c757d",
  paddingVertical: vs(6),
  paddingHorizontal: s(12),
  borderRadius: s(8),
},
backText: {
  color: "#fff",
  fontSize: s(14),
  fontWeight: "600",
},
closeBtn: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
},
});
