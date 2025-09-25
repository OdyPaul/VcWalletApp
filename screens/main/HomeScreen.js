import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import UserAvatar from "../../components/UserAvatar";
import NotificationButton from "../../components/NotificationButton";
import { s, vs } from "react-native-size-matters";
import { light, dark } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.settings.darkMode);
  const colors = darkMode ? dark : light;
  const navigation = useNavigation();
// After filling VC form → go to face capture
  const handleNext = () => {
  if (!type || !course) {
    Alert.alert("Error", "Type and Course are required");
    return;
  }
  navigation.navigate("FaceCapture", { type, course, yearGraduated });
};

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <UserAvatar />
        <View style={styles.textContainer}>
          <Text style={[styles.welcome, { color: colors.sub }]}>Welcome,</Text>
          <Text style={[styles.username, { color: colors.text }]}>
            {user?.name || "Guest"}
          </Text>
        </View>
        <NotificationButton />
      </View>

      {/* VC Request Container */}
      <TouchableOpacity
        style={[styles.dashedBox, { borderColor: colors.sub }]}
        onPress={() => navigation.navigate("VCForm")}
      >
        <Text style={[styles.addText, { color: colors.sub }]}>
          + Add a Credential
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: vs(60), paddingHorizontal: s(17), flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: { flex: 1, marginLeft: 10 },
  welcome: { fontSize: 14 },
  username: { fontSize: 18, fontWeight: "bold" },
  dashedBox: {
    marginTop: vs(40),
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { fontSize: 16, fontWeight: "600" },
});
