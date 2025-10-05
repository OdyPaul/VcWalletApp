// screens/ConnectWalletScreen.js
import "react-native-get-random-values";
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/auth/authSlice";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "setLayoutAnimationEnabledExperimental",
  "SafeAreaView has been deprecated",
  "Falling back to file-based resolution",
  "WebSocket connection closed",
]);

const projectId = "2909466446bb37af0f229b405872de47"; // your WalletConnect Cloud project ID

const providerMetadata = {
  name: "VcWalletApp",
  description: "DID connection for verification",
  url: "https://example.com",
  icons: ["https://walletconnect.com/walletconnect-logo.png"],
  redirect: {
    native: "vcwalletapp://", // 👈 must match app.json scheme
  },
};

export default function ConnectWalletScreen({ navigation }) {
  const { open, close, isConnected, address } = useWalletConnectModal({
    projectId,
    providerMetadata,
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const connectWallet = async () => {
    try {
      await open();
    } catch (err) {
      Alert.alert("Connection failed", err.message);
    }
  };

const saveWalletAsDID = async () => {
  if (!isConnected || !address) {
    return Alert.alert("Please connect your wallet first.");
  }

  try {
    setLoading(true);
    const token = user?.token;

    const updatedUser = await dispatch(
      updateWalletDID({ userId: user._id, walletAddress: address, token })
    ).unwrap();

    dispatch(updateUser(updatedUser)); // from authSlice
    Alert.alert("✅ Success", "Wallet linked to your DID!");
    navigation.goBack();
  } catch (err) {
    console.error("❌ DID Update Error:", err);
    Alert.alert("Error", err || "Failed to save DID");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Wallet</Text>

      {isConnected ? (
        <>
          <Text style={styles.addr}>Wallet Address:</Text>
          <Text style={styles.addressValue}>{address}</Text>
          <View style={{ height: 20 }} />
          <Button title={loading ? "Saving..." : "Save as DID"} onPress={saveWalletAsDID} />
          <View style={{ height: 10 }} />
          <Button title="Disconnect" color="red" onPress={close} />
        </>
      ) : (
        <Button title="Connect Wallet" onPress={connectWallet} />
      )}

      <WalletConnectModal projectId={projectId} providerMetadata={providerMetadata} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  addr: { fontSize: 14, marginBottom: 6, textAlign: "center" },
  addressValue: { fontSize: 12, color: "#555", textAlign: "center", marginBottom: 20 },
});
