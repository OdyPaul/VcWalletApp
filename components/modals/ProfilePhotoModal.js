import React from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePhotoModal({ visible, onClose, onTakePhoto, onPickGallery, onRemove }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Profile Photo</Text>

          <View style={styles.actions}>
            <Pressable style={styles.actionBtn} onPress={onTakePhoto}>
              <Ionicons name="camera-outline" size={24} color="#fbbf24" />
              <Text style={styles.actionText}>Camera</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={onPickGallery}>
              <Ionicons name="images-outline" size={24} color="#fbbf24" />
              <Text style={styles.actionText}>Gallery</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={onRemove}>
              <Ionicons name="trash-outline" size={24} color="#ef4444" />
              <Text style={styles.actionText}>Remove</Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: '#111',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 6,
    fontSize: 14,
    color: '#111',
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  closeText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '500',
  },
});
