import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import UserAvatar from '../../components/UserAvatar';
import NotificationButton from '../../components/NotificationButton';
import { s, vs } from 'react-native-size-matters';
import { light, dark } from '../../theme/color';
import { toggleDarkMode } from '../../features/settings/settingsSlice';

export default function HomeScreen() {
  const user = useSelector(state => state.auth.user);
   const darkMode = useSelector(state => state.settings.darkMode);
  const colors = darkMode ? dark : light;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <UserAvatar />
        <View style={styles.textContainer}>
          <Text style={[styles.welcome, { color: colors.sub }]}>Welcome,</Text>
          <Text style={[styles.username, { color: colors.text }]}>{user?.name || 'Guest'}</Text>
        </View>
        <NotificationButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: vs(60), paddingHorizontal: s(17) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textContainer: { flex: 1, marginLeft: 10 },
  welcome: { fontSize: 14 },
  username: { fontSize: 18, fontWeight: 'bold' },
});
