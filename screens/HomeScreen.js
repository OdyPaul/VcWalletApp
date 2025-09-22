import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const { token } = route.params;

  const handleLogout = () => {
    Alert.alert('Logged out');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#007bff' }]}
      onPress={() => navigation.navigate('Camera', { token })}
    >
      <Text style={styles.buttonText}>Open Camera</Text>
    </TouchableOpacity>


      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#dc3545', marginTop: 20 }]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
