import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontsizes } from '@/constants'
import { StatusBar } from 'expo-status-bar'
import CurvyLine1 from '@/svg/curvy1'
import Button from '@/components/Button'

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
  return (
    <SafeAreaView style={{ paddingHorizontal: 16, backgroundColor: colors.light.black, flex: 1}}>
      <View style={{ position: "absolute",zIndex: -1, top: "10%", width: 1 }}>
        <CurvyLine1 style={{transform: [{ rotate: "15deg" }] }}/>
      </View>
      <SafeAreaView style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        <Text style={{fontSize: fontsizes.heading2,color: "#fff", fontFamily: "Satoshi-Bold"}}>Let's Get Started!</Text>
        <Text style={{fontSize: fontsizes.paragraph1,color: colors.light.overlay_white,textAlign: "center", opacity: 0.5, fontFamily: "Satoshi-Regular"}}>Create a chomsky account or Login if you
        already{"\n"} have an account</Text>
          <Button icon={<Image source={require("@/assets/icon/mail.png")} style={{width: 20, height: 20}} resizeMode='contain'/>} type='normal' color={colors.light.overlay_white} title="Continue with Email" style={{borderRadius: 50 , marginVertical: 10}} width={"80%"} textColor='#000'/>
        <Line/>
          <Button icon={<Image source={require("@/assets/icon/google.png")} style={{width: 20, height: 20}} resizeMode='contain'/>} type='normal' color={colors.light.overlay_white} title="Continue with Google" style={{borderRadius: 50 , marginVertical: 10}} width={"80%"} textColor='#000'/>
          <Text style={{color: "#fff", fontFamily: "Satoshi-Medium"}}>Already have an account? <Text style={{color: colors.light.primary}}>Login</Text>.</Text>
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