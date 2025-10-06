// AppNavigation.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../features/auth/authSlice';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens//auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import HomeScreen from '../screens/main/HomeScreen';
import CredentialsScreen from '../screens/main/CredentialsScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';
import PersonalInfoScreen from '../screens/settings/PersonalInfoScreen';
import ConnectWalletScreen from '../screens/settings/ConnectWalletScreen';
import AvatarCameraScreen from '../screens/camera/AvatarCamerScreen';
import VCFormScreen from '../screens/vc/VCFormScreen';
import FaceCaptureScreen from '../screens/camera/FaceCaptureScreen';
import ValidIDCaptureScreen from '../screens/camera/ValidIDCaptureScreen';
import VerifyAccount from '../screens/settings/VerifyAccount';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Credentials') iconName = 'document-text-outline';
          else if (route.name === 'History') iconName = 'time-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Credentials" component={CredentialsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(loadUser());
      setLoading(false);
    };
    fetchUser();
  }, [dispatch]);

  if (loading) return null; // or a splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
        <>
            {/* App flow */}
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="AvatarCamera" component={AvatarCameraScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyAccount" component={VerifyAccount} options={{ title: "Verify Account" }} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
            <Stack.Screen name="ConnectWallet" component={ConnectWalletScreen} />
            
            
            {/* <Stack.Screen name="ConnectToMetamask" component={ConnectToMetamaskScreen} options={{ title: "Connect to Metamask" }}/> */}

            {/* VC Request Flow */}
            <Stack.Screen name="VCForm" component={VCFormScreen} options={{ title: "New VC Request" }} />
            <Stack.Screen name="FaceCapture" component={FaceCaptureScreen} options={{ title: "Capture Face" }} />
            <Stack.Screen name="ValidIDCapture" component={ValidIDCaptureScreen} options={{ title: "Capture Valid ID" }} />
          </>
        ) : (
          <>
            {/* Auth flow */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
