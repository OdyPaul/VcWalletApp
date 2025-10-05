import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDID, updateUser } from "../../features/auth/authSlice";


LogBox.ignoreLogs([
  "setLayoutAnimationEnabledExperimental",
  "SafeAreaView has been deprecated",
  "Falling back to file-based resolution",
  "WebSocket connection closed",
]);

const projectId = "2909466446bb37af0f229b405872de47";

const providerMetadata = {
  name: "VcWalletApp",
  description: "DID connection for verification",
  url: "https://example.com",
  icons: ["https://walletconnect.com/walletconnect-logo.png"],
  redirect: { native: "vcwalletapp://" },
};

export default function ConnectWalletScreen({ navigation }) {
  const { open, close, isConnected, address } = useWalletConnectModal({
    projectId,
    providerMetadata,
  });
  
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // 🪙 Auto-save when connected
  useEffect(() => {
    if (isConnected && address && !loading) {
      handleAutoSave();
    }
  }, [isConnected, address]);

  // 🪙 Auto-reconnect WalletConnect when user already has DID
useEffect(() => {
  if (user?.walletAddress && !isConnected && !loading) {
    console.log("🔁 Auto-reconnecting to wallet:", user.walletAddress);
    open().catch((err) => console.warn("Wallet auto-reconnect failed:", err));
  }
}, [user?.walletAddress]);

  const handleAutoSave = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return Alert.alert("Missing token. Please log in again.");

      // ✅ Correct action name
        const updatedUser = await dispatch(
          updateUserDID({
            userId: user._id,
            walletAddress: address,
            token,
          })
        ).unwrap();

      // ✅ Sync Redux user state
      dispatch(updateUser(updatedUser));

      Alert.alert("✅ Wallet Connected", "Your wallet has been linked successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("❌ DID Update Error:", err);
      Alert.alert("Error", err.message || "Failed to save wallet.");
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      await open();
    } catch (err) {
      Alert.alert("Connection failed", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Back to Settings</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Connect Your Wallet</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : isConnected ? (
        <>
          <Text style={styles.addr}>Connected Address:</Text>
          <Text style={styles.addressValue}>{address}</Text>
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: { marginLeft: 6, fontSize: 16, color: "#000" },
});
