import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const { startTokenExpirationCheck } = useAuthStore()
  const [loaded, error] = useFonts({
    'Satoshi-Black': require('@/assets/fonts/Satoshi-Black.otf'),
    'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium.otf'),
    'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Light': require('@/assets/fonts/Satoshi-Light.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  // useEffect( () => startTokenExpirationCheck(), [])

  if (!loaded && !error) {
    return null;
  }
  return <Stack screenOptions={{headerShown: false}}/>;
}
