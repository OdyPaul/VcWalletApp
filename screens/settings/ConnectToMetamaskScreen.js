import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { WalletConnectModal, useWalletConnectModal } from "@walletconnect/modal-react-native";

// Get this from https://cloud.walletconnect.com
const projectId = "2909466446bb37af0f229b405872de47";

export default function ConnectToMetamaskScreen() {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [signature, setSignature] = useState(null);

  // Sign message to prove DID ownership
  const signMessage = async () => {
    if (!isConnected || !address) {
      Alert.alert("Error", "Connect MetaMask first.");
      return;
    }
    try {
      const msg = "I am proving ownership of this DID.";
      const encodedMessage = `0x${Buffer.from(msg, "utf8").toString("hex")}`;

      const result = await provider.request({
        method: "personal_sign",
        params: [encodedMessage, address],
      });

      console.log("Signature:", result);
      setSignature(result);
      Alert.alert("Success", "Message signed!");
    } catch (err) {
      console.error("Sign error:", err);
      Alert.alert("Error", "Failed to sign message.");
    }
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Text style={styles.text}>My DID:</Text>
          <Text style={styles.account}>did:ethr:{address}</Text>

          <TouchableOpacity style={styles.button} onPress={signMessage}>
            <Text style={styles.buttonText}>Sign Message</Text>
          </TouchableOpacity>

          {signature && (
            <Text style={styles.signature} numberOfLines={2}>
              Signature: {signature}
            </Text>
          )}
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => open()}>
          <Text style={styles.buttonText}>Connect to MetaMask</Text>
        </TouchableOpacity>
      )}

      {/* WalletConnect Modal */}
      <WalletConnectModal projectId={projectId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  text: { color: "#fff", fontSize: 16, marginBottom: 4 },
  account: { color: "#0f0", fontSize: 14, marginBottom: 20 },
  signature: { color: "#0ff", fontSize: 12, marginTop: 20, textAlign: "center", paddingHorizontal: 20 },
  button: { padding: 12, backgroundColor: "#007bff", borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
