import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Let's get started</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Register Now</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={{fontWeight: 'bold'}}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14, 
    color: '#555',
  }
});
