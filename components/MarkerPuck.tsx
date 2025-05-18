import { View, Text } from 'react-native'
import React from 'react'
import UserPuck from '@/svg/user_puck'
import { Marker } from 'react-native-maps'

const MarkerPuck = ({userLocation, image}) => {
  return (
    <View>
      <Marker
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude
            }}
            title="You are here"
            description="Your current location"
          >
            <View style={{
                borderRadius: 20,
                padding: 6,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            }}>
              <UserPuck image={image}/>
            </View>
            </Marker>
    </View>
  )
}

export default MarkerPuck