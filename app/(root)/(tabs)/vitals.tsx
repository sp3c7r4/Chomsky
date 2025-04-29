import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'

const vitals = () => {
  return (
    <SafeAreaView>
      <Text>vitals</Text>
      <StatusBar style='auto'/>
    </SafeAreaView>
  )
}

export default vitals