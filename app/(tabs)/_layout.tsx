// filepath: c:\Users\SP3C7R4\Documents\Personal Projects\ICare-new\Chomsky\app\(tabs)\_layout.tsx
import { Tabs } from 'expo-router';
import Vitalssvg from '@/svg/vitals'
import LocationSvg from '@/svg/location';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import ProfileSvg from '@/svg/profile';
import SettingSVG from '@/svg/settings';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      >
        <Tabs.Screen 
        name="vitals" 
        options={{ 
          tabBarIcon: ({ focused }) => (
          <Vitalssvg color={focused ? "#32B582" : "#000"} />
          ) 
        }} 
        />
        <Tabs.Screen 
        name="location" 
        options={{ 
          tabBarIcon: ({ focused }) => (
          <LocationSvg color={focused ? "#32B582" : "#000"} />
          ) 
        }} 
        />
        <Tabs.Screen 
        name="chomsky" 
        options={{
          tabBarButton: (props) => (
            <TouchableWithoutFeedback {...props}>
            <View style={{ position: "absolute", top: -30 }}>
              <Image style={{ marginBottom: 30 }} source={require('@/assets/images/chomsky.png')} />
            </View>
            </TouchableWithoutFeedback>
          ),
        }} 
        />
      <Tabs.Screen name="profile" options={{ 
          tabBarIcon: ({focused}) => <ProfileSvg color={focused ? "#32B582" : "#000"}/> 
        }} 
      />
      <Tabs.Screen name="settings" options={{ 
          tabBarIcon: ({focused}) => <SettingSVG color={focused ? "#32B582" : "#000"}/> 
        }} 
      />
    </Tabs>
  );
};

export default _layout;