import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function NewUserVerifyModal({ visible, user, onClose, onConnectWallet, onVerify }) {
  if (!visible) return null;

  const hasDID = !!user?.did;
  const isVerified = user?.verified === "verified";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>👋 Hi new user!</Text>
          <Text style={styles.message}>
            {hasDID
              ? "Welcome! Please verify your account to request credentials."
              : "Welcome! Let's connect your wallet first to continue."}
          </Text>

          <Text style={styles.name}>
            @{user?.username || "guest"}
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btn, styles.skip]} onPress={onClose}>
              <Text style={[styles.btnText, { color: "#666" }]}>Skip for now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.confirm]}
              onPress={hasDID ? onVerify : onConnectWallet}
            >
            <Text style={[styles.btnText, { color: "#fff" }]}>
            {hasDID ? "Let's Verify" : "Let's Go →"}
            </Text>

            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    color: "#555",
    fontSize: 15,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  btn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  skip: {
    backgroundColor: "#eee",
  },
  confirm: {
    backgroundColor: "#007AFF",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
