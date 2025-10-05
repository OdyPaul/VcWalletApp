import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../features/auth/authSlice";
import { authExtraActions } from "../../features/auth/authSlice";
import { useWalletConnectModal } from "@walletconnect/modal-react-native"; // ✅ add this

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  // ✅ WalletConnect modal hook
  const { open, isConnected, provider, address } = useWalletConnectModal();

  useEffect(() => {
    if (isError) {
      Alert.alert("Error", message);
      dispatch(reset());
    }

    if (isSuccess || user) {
      if (user?.name) {
        Alert.alert("Login Success", `Welcome ${user.name}`);
      }

      // ✅ Handle DID logic here
      handleDIDUpdate(user);

      authExtraActions(dispatch).onLoginSuccess(user);
      dispatch(reset());
    }
  }, [isError, isSuccess, user, message]);

  const handleLogin = () => {
    dispatch(login({ email, password }))
      .unwrap()
      .then((user) => {
        authExtraActions(dispatch).onLoginSuccess(user);
      })
      .catch(() => {});
  };

  // ✅ DID + Wallet logic
  const handleDIDUpdate = async (user) => {
    try {
      if (!user) return;

      // 1️⃣ If user already has a DID, skip
      if (user.did) {
        console.log("✅ User already has DID:", user.did);
        return;
      }

      // 2️⃣ Otherwise, try to connect wallet
      if (!isConnected) {
        console.log("🔗 Opening WalletConnect...");
        await open();
      }

      // 3️⃣ If still not connected, stop here
      if (!provider || !address) {
        Alert.alert("Wallet Required", "Please connect your wallet to continue.");
        return;
      }

      // 4️⃣ Update DID to backend
      console.log("🪪 Updating DID:", address);
      await authExtraActions(dispatch).updateDID(user._id, address);

      Alert.alert("Wallet Connected", "Your wallet address has been linked successfully!");
    } catch (err) {
      console.log("❌ DID Update Error:", err.message);
    }
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

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  link: { marginTop: 15, textAlign: "center", color: "#007BFF" },
});
