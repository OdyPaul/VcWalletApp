import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import UserAvatar from '../components/UserAvatar';
import NotificationButton from '../components/NotificationButton';
import { s, vs } from 'react-native-size-matters';

export default function HomeScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserAvatar />
        <NotificationButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: vs(60), paddingHorizontal: s(17) },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
});
