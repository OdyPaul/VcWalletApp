import {StyleSheet,Image, View, Text } from 'react-native'
import React from 'react'
import {s} from "react-native-size-matters"
const UserAvatar = () => {
  return (
    <Image
    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx7yKZdPwOkWL3eEl-0rtXJ28RDLji_8YaIQ&s"}}
        style={styles.avatar}
    />
  )
}

export default UserAvatar

const styles = StyleSheet.create({
  avatar:{
    height:s(32),
    width:s(32),
    borderRadius:s(16),
  }

})


