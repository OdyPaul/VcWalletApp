import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

export default function UserAvatar() {
  const user = useSelector((state) => state.auth.user);
  const { avatar, previewUri } = useSelector((state) => state.avatar);

  const displayUri = previewUri || avatar?.uri;

  return (
    <TouchableOpacity style={styles.container}>
      {displayUri ? (
        <Image source={{ uri: displayUri }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initials}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "black",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
