import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import AppNavigation from "./navigation/AppNavigation";
import { loadUser } from "./features/auth/authSlice";
import { BackHandler } from "react-native";
import "react-native-url-polyfill/auto";
import { useSelector } from "react-redux";
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

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // 🧠 Auto reconnect if user has DID saved
  useEffect(() => {
    if (user?.did && !isConnected) {
      console.log("🔁 Reconnecting to existing wallet:", user.did);
      open().catch((err) => console.warn("Auto reconnect failed:", err));
    }
  }, [user?.did, isConnected]);

  return <AppNavigation />;
}

// 🧱 Polyfill fix for WalletConnect (older RN versions)
if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = (eventName, handler) => {
    console.warn(
      "⚠️ BackHandler.removeEventListener is deprecated. Using new API."
    );
    // RN 0.65+ no longer uses this — safe no-op
  };
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
