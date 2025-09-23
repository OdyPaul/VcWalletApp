// screens/CredentialsScreen.js
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";

const dummyCredentials = [
  { id: "1", title: "Diploma", dateIssued: "2025-06-15" },
  { id: "2", title: "Transcript of Records", dateIssued: "2025-06-16" },
  { id: "3", title: "Certificate of Grades", dateIssued: "2025-06-20" },
];

export default function CredentialsScreen() {
  const [credentials] = useState(dummyCredentials);

  const handleShare = (credential) => {
    Alert.alert("Share Credential", `QR Code generated for ${credential.title}`);
    // Later: Implement QR code pop-up or share to employer
  };

  const handleView = (credential) => {
    Alert.alert("View Credential", `Opening ${credential.title} details...`);
    // Later: Navigate to detailed credential view or PDF preview
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Credentials</Text>

      <FlatList
        data={credentials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>Issued: {item.dateIssued}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.viewButton]}
                onPress={() => handleView(item)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
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
  container: { flex: 1, backgroundColor: "#f8f8f8", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "600" },
  date: { fontSize: 14, color: "#666", marginTop: 4 },
  buttons: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButton: { backgroundColor: "#007bff" },
  shareButton: { backgroundColor: "#28a745" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
