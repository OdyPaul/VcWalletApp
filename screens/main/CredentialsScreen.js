import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSelector } from "react-redux";
import { light, dark } from '../../theme/color';

const dummyCredentials = [
  { id: "1", title: "Diploma", dateIssued: "2025-06-15" },
  { id: "2", title: "Transcript of Records", dateIssued: "2025-06-16" },
  { id: "3", title: "Certificate of Grades", dateIssued: "2025-06-20" },
];

export default function CredentialsScreen() {
  const [credentials] = useState(dummyCredentials);
  const darkMode = useSelector(state => state.settings.darkMode); // adjust to your redux store
  const colors = darkMode ? dark : light;

  const handleShare = (credential) => {
    Alert.alert("Share Credential", `QR Code generated for ${credential.title}`);
  };

  const handleView = (credential) => {
    Alert.alert("View Credential", `Opening ${credential.title} details...`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>My Credentials</Text>

      <FlatList
        data={credentials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.date, { color: colors.sub }]}>Issued: {item.dateIssued}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#007bff' }]}
                onPress={() => handleView(item)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#28a745' }]}
                onPress={() => handleShare(item)}
              >
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "600" },
  date: { fontSize: 14, marginTop: 4 },
  buttons: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  button: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
