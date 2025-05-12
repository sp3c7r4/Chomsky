import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { fontsizes } from '@/constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const AuthHeader = () => {
  return (
    <View style={{ gap: 10, flexDirection: "row", paddingVertical: 15, marginTop: 10}}>
      <Pressable onPress={() => router.back()}>
        <Image source={require('@/assets/icon/back.png')} style={{width: 35, height: 35}}/>
      </Pressable>
      <View>
        <Text style={{fontSize: 20, color: "#fff", fontFamily: "Satoshi-Bold" }}>Let’s create new account</Text>
        <Text style={{fontSize: 11, color: "#fff", opacity: 0.5, fontFamily: "Satoshi-Medium" }}>Create an account by filling in the data below</Text>
      </View>
    </View>
  )
}

export default AuthHeader