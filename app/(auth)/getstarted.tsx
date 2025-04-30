import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontsizes } from '@/constants'
import { StatusBar } from 'expo-status-bar'
import CurvyLine1 from '@/svg/curvy1'
import Button from '@/components/Button'
import AnimatedLeaf from '@/components/Leaf'
import { router } from 'expo-router'

function Line() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>Or</Text>
      <View style={styles.line} />
    </View>
  );
}

const getstarted = () => {
  const leaves = Array.from({ length: 5 }); // create 5 leaves

  return (
    <SafeAreaView style={{ paddingHorizontal: 16, backgroundColor: colors.light.background_black, flex: 1}}>
      <View style={{ position: "absolute",zIndex: -1, top: "10%"}}>
        <CurvyLine1 style={{transform: [{ rotate: "15deg" }] }}/>
      </View>
      <View style={{position: "absolute", zIndex: 3}}>
        <AnimatedLeaf />
      </View>
      <SafeAreaView style={{alignItems: "center", justifyContent: "center", flex: 1}}>
      {/* {leaves.map((_, i) => ( */}
      {/* ))} */}
        <Text style={{fontSize: fontsizes.heading2,color: "#fff", fontFamily: "Satoshi-Bold"}}>Let's Get Started!</Text>
        <Text style={{fontSize: 14,color: colors.light.overlay_white,textAlign: "center", opacity: 0.5, fontFamily: "Satoshi-Regular"}}>Get started with Chomsky or log in to continue.</Text>
          <Button onPress={() => router.push({pathname: "/(auth)/signup"})} icon={<Image source={require("@/assets/icon/mail.png")} style={{width: 20, height: 20}} resizeMode='contain'/>} type='normal' color={colors.light.overlay_white} title="Continue with Email" style={{borderRadius: 50 , marginVertical: 10}} width={"80%"} textColor='#000'/>
        <Line/>
          <Button icon={<Image source={require("@/assets/icon/google.png")} style={{width: 20, height: 20}} resizeMode='contain'/>} type='normal' color={colors.light.overlay_white} title="Continue with Google" style={{borderRadius: 50 , marginVertical: 10}} width={"80%"} textColor='#000'/>
          <Text style={{color: "#fff", fontSize: 11, fontFamily: "Satoshi-Medium"}}>Want to know more about chomsky? <Text style={{color: colors.light.primary}}>CLick me</Text>.</Text>
      </SafeAreaView>
    <StatusBar style='auto'/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  line: {
    // flex: 1,
    width: "30%",
    height: 0.5,
    backgroundColor: '#444', // adjust color to match your theme
  },
  text: {
    marginHorizontal: 10,
    color: '#ccc', // adjust color to match your theme
    fontSize: 14,
    fontFamily: "Satoshi-Medium"
  },
});

export default getstarted