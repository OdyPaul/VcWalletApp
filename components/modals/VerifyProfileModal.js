// file: components/modals/ConfirmVerifyModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmVerifyModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Verify Account</Text>
          <Text style={styles.message}>
            Are you sure you want to start the verification process?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={onConfirm}>
              <Text style={[styles.btnText, { color: "#fff" }]}>Yes, Verify</Text>
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
  modalCard: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 14, marginBottom: 20 },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  cancel: { backgroundColor: "#eee", marginRight: 8 },
  confirm: { backgroundColor: "#0a84ff" },
  btnText: { fontSize: 14, fontWeight: "600" },
});
