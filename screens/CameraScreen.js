import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URL } from '../config';

export default function CameraScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);
 const { token } = route.params; 

  if (!permission) return <View />;
  if (!permission.granted) {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#fff' }}>We need camera permissions</Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#007bff' }]} 
        onPress={requestPermission}
      >
        <Text style={styles.buttonText}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );
}


  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setPhotoUri(photo.uri);
    }
  };

  const uploadPhoto = async () => {
    if (!photoUri || !token) return;

    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const res = await fetch(`${API_URL}/api/photos`, {
        method: 'POST',
        body: formData,
        headers: { 
          Authorization: `Bearer ${token}`,
          // Remove the Content-Type header - let React Native set it automatically
        },
      });

      // First, check the response status
      console.log('Response status:', res.status);
      
      // Try to parse as JSON, but fall back to text if it fails
      let responseData;
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }
      
      console.log('Server response:', responseData);

      if (res.ok) {
        Alert.alert('Success', 'Photo uploaded successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Upload failed', responseData.message || responseData);
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Network request failed: ' + err.message);
    }
  };



  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={() => setPhotoUri(null)}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={uploadPhoto}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          <View style={styles.buttonOverlay}>
            <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  buttonOverlay: {
    position: 'absolute',
    bottom: 64,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: { padding: 12, backgroundColor: '#00000088', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preview: { width: '90%', height: '70%', borderRadius: 12 },
  actionRow: { flexDirection: 'row', marginTop: 20, width: '70%', justifyContent: 'space-between' },
});
