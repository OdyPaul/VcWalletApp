import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/store";
import AppNavigation from "./navigation/AppNavigation";
import { loadUser } from "./features/auth/authSlice";
import { BackHandler } from "react-native";
import "react-native-url-polyfill/auto";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";

function Root() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { open, isConnected } = useWalletConnectModal({
    projectId: "2909466446bb37af0f229b405872de47",
    providerMetadata: {
      name: "VcWalletApp",
      description: "DID connection for verification",
      url: "https://example.com",
      icons: ["https://walletconnect.com/walletconnect-logo.png"],
      redirect: { native: "vcwalletapp://" },
    },
  });

  // 🧩 Load user from AsyncStorage on app start
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // 🪪 Auto reconnect (only if DID exists and Wallet not connected yet)
  useEffect(() => {
    if (user?.did && !isConnected) {
      console.log("🔁 Attempting auto reconnect for DID:", user.did);
      // ⚠️ WalletConnect cannot truly "reconnect" automatically
      // unless session is cached — this is a UX prompt instead:
      // open() will open modal for reconnection if possible.
      open().catch((err) =>
        console.warn("⚠️ Wallet auto reconnect failed:", err.message)
      );
    }
  }, [user?.did, isConnected]);

  return <AppNavigation />;
}

// 🧱 Polyfill fix for WalletConnect (older RN versions)
if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = (eventName, handler) => {
    console.warn("⚠️ BackHandler.removeEventListener is deprecated.");
  };
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
