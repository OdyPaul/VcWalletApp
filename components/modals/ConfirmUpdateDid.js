import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmUpdateDid({ visible, onClose, onConfirm }) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Update Wallet</Text>
          <Text style={styles.message}>
            Do you want to update your connected wallet?
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.btn, styles.cancel]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.confirm]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>Confirm</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#eee",
  },
  confirm: {
    backgroundColor: "#007AFF",
  },
  btnText: {
    fontWeight: "bold",
  },
});
