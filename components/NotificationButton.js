import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import {s} from 'react-native-size-matters'

const NotificationButton = () => {
  return (
    <TouchableOpacity style={styles.container}>
    <Ionicons name="notifications-outline" size={s(20)} color="black" />
    </TouchableOpacity>
  )
}

export default NotificationButton

const styles = StyleSheet.create({
      container:{
        height:s(32),
        width:s(32),
        borderRadius:s(16),
        backgroundColor:"#ECF0F4",
        alignItems: 'center',      // centers horizontally
        justifyContent: 'center',  // centers vertically
      }

})