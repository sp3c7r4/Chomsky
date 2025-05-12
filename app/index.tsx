import { Redirect, router, Stack } from "expo-router";
import { Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '@/assets/images/logo.png'
import founders from '@/assets/images/founders.png'
import { useEffect } from "react";
// import { io } from "socket.io-client";


import { useState } from "react";

export default function Index() {
  
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRedirect(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (redirect) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center"}}>
      <Image source={logo} style={{ width: 230, height: 60 }} resizeMode="contain"/>
      <Image source={founders} style={{ width: 100, height: 60, position: "absolute", bottom: 0, marginBottom: 10 }} resizeMode="contain"/>
      <StatusBar style="auto"/>
    </SafeAreaView>
  );
}
