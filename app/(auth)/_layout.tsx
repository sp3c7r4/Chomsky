import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="getstarted"/>
      <Stack.Screen name="signin"/>
      <Stack.Screen name="signup"/>
    </Stack>
  )
}

export default _layout