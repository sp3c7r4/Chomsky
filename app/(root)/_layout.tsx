import React from 'react'
import { Stack } from 'expo-router'
import * as SystemUI from "expo-system-ui";

SystemUI.setBackgroundColorAsync("#000");

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown: false, animation: "fade"}}>
      <Stack.Screen name="(tabs)"/>
    </Stack>
  )
}

export default _layout