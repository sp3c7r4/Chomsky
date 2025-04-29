import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants'
import AuthHeader from '@/components/AuthHeader'

const signup = () => {
  return (
    <SafeAreaView style={{backgroundColor: colors.light.black, flex: 1, paddingHorizontal: 16}}>
      <AuthHeader/>
      <Text>signup</Text>
    </SafeAreaView>
  )
}

export default signup