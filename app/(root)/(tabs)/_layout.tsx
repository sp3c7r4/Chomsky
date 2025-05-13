import { Tabs } from 'expo-router';
import Vitalssvg from '@/svg/vitals'
import LocationSvg from '@/svg/location';
import { Image, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import ProfileSvg from '@/svg/profile';
import SettingSVG from '@/svg/settings';
import { Svg, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HapticTab(props: any) {
  const { children, style, ...rest } = props;

  return (
    <Pressable
      {...rest}
      android_ripple={null}
      style={style}
    >
      {children}
    </Pressable>
  );
}

const _layout = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          shadowOpacity: 0,
          elevation: 0,
          borderTopWidth: 0,
          height: 60 + insets.bottom, // Adjust height considering safe area
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 5,
          paddingBottom: insets.bottom,
        },
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarBackground: () => (
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100 + insets.bottom,
            width: "100%",
            overflow: 'hidden'
          }}>
            <Svg
              width="100%" // Use percentage instead of fixed width
      height={"100%"}
      viewBox="0 0 375 120"
      preserveAspectRatio="xMidYMid slice" // This helps maintain the aspect ratio while filling the width
      fill="none"
            >
              <Path d="M374.5 0C240.1 52.8 67.5 22-2 0v120h376.5V0z" fill="#F9F9F9" />
            </Svg>
          </View>
        ),
        animation: "fade",
        headerPressColor: "transparent"
      }}
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
              <View style={{ 
                position: "absolute", 
                top: -50,
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80
              }}>
                <Image 
                  source={require('@/assets/images/chomsky.png')} 
                  style={{
                    width: 80,
                    height: 80,
                    resizeMode: 'contain'
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          tabBarIcon: ({focused}) => (
            <ProfileSvg color={focused ? "#32B582" : "#000"}/> 
          )
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          tabBarIcon: ({focused}) => (
            <SettingSVG color={focused ? "#32B582" : "#000"}/> 
          )
        }} 
      />
    </Tabs>
  );
};

export default _layout;