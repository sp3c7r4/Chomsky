import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fontsizes } from '@/constants'
import { StatusBar } from 'expo-status-bar'
import CurvyLine1 from '@/svg/curvy1'
import Button from '@/components/Button'


const getstarted = () => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.light.black, flex: 1}}>
      <View style={{ position: "absolute",zIndex: -1, top: "10%", width: 1 }}>
        <CurvyLine1 style={{transform: [{ rotate: "15deg" }] }}/>
      </View>
      <SafeAreaView style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        <Text style={{fontSize: fontsizes.heading2,color: "#fff", fontFamily: "Satoshi-Bold"}}>Let's Get Started!</Text>
        <Text style={{fontSize: fontsizes.paragraph1,color: colors.light.overlay_white,textAlign: "center", opacity: 0.5, fontFamily: "Satoshi-Regular"}}>Create an iCare account or Login if you
        already{"\n"} have an account</Text>
          <Button style={{marginVertical: 100}} icon={<Image source={require("@/assets/icon/mail.png")} style={{width: 20, height: 20}} resizeMode='contain'/>} type='normal' color={colors.light.overlay_white} title="Continue with Email" style={{borderRadius: 50}} width={"80%"} textColor='#000'/>
      </SafeAreaView>
    <StatusBar style='auto'/>
    </SafeAreaView>
  )
}

export default getstarted