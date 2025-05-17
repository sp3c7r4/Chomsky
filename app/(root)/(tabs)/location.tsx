import { View, Text } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps';

const location = () => {
  return (
    <View style={{flex: 1}}>
      <MapView style={{width: '100%',height: '100%',}} initialRegion={{
    latitude: 6.465422,      // Lagos, Nigeria latitude :contentReference[oaicite:0]{index=0}
    longitude: 3.406448,     // Lagos, Nigeria longitude :contentReference[oaicite:1]{index=1}
    latitudeDelta: 0.5,      // ~50 km span north–south
    longitudeDelta: 0.5,     // ~50 km span east–west
  }}/>
    </View>
  )
}

export default location