import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import { authExtraActions } from '../../features/auth/authSlice'; // 👈 import

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector(state => state.auth);

  useEffect(() => {
    if (isError) {
      Alert.alert('Error', message);
      dispatch(reset());
    }

    if (isSuccess || user) {
      Alert.alert('Login Success', `Welcome ${user.name}`);

      // ✅ load avatar immediately after login
      authExtraActions(dispatch).onLoginSuccess(user);

      dispatch(reset());
      navigation.replace('MainTabs'); 
    }
  }, [isError, isSuccess, user, message]);

  const handleLogin = () => {
    // 👉 wait for login thunk to finish
    dispatch(login({ email, password }))
      .unwrap()
      .then((user) => {
        // ✅ also safe to load avatar here
        authExtraActions(dispatch).onLoginSuccess(user);
      })
      .catch(() => {
        // error already handled by isError
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        value={password} 
        secureTextEntry 
        onChangeText={setPassword} 
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  link: { marginTop: 15, textAlign: 'center', color: '#007BFF' },
});
