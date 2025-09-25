import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function VCFormScreen({ navigation }) {
  const [lrn, setLrn] = useState("");
  const [type, setType] = useState("");
  const [course, setCourse] = useState("");
  const [yearGraduated, setYearGraduated] = useState("");

  const handleNext = () => {
    const finalLRN = lrn.trim() === "" ? "N/A" : lrn.trim();

    if (!type) {
      Alert.alert("Error", "Please select a type");
      return;
    }

    navigation.navigate("FaceCapture", { 
      lrn: finalLRN, 
      type, 
      course, 
      yearGraduated 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>LRN (Leave blank if forgotten)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter LRN or leave blank"
        value={lrn}
        onChangeText={setLrn}
      />

      <Text style={styles.label}>Type</Text>
      <RNPickerSelect
        onValueChange={(value) => setType(value)}
        items={[
          { label: "Degree", value: "DEGREE" },
          { label: "TOR", value: "TOR" },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select type...", value: null }}
        value={type}
      />

      <Text style={styles.label}>Course</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Course"
        value={course}
        onChangeText={setCourse}
      />

      <Text style={styles.label}>Year Graduated</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Year Graduated"
        value={yearGraduated}
        onChangeText={setYearGraduated}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.btnText}>Next (Face Capture)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    marginTop: 5,
  },
};
