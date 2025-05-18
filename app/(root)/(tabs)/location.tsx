import { View, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { mapStyle } from '@/constants';
import * as Location from 'expo-location';
import UserPuck from '@/svg/user_puck';
import MarkerPuck from '@/components/MarkerPuck';

const data = {
  id: "01JQ0DAG9J05S6CDKSS8C405HF",
  firstname: "Spectra",
  lastname: "Gee",
  email: "spectragee@gmail.com",
  createdAt: "2025-03-23 03:29:16.212+01",
  updatedAt: "2025-03-23 03:29:16.212+01",
  photo: require('@/assets/images/spectra.jpg')
};

const LocationScreen = () => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    // Request location permission and get initial location
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
      console.log('Got location:', location);
      setUserLocation(location);
      
      // Optional: Set up location subscription for real-time updates
      Location.watchPositionAsync(
        { 
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10  // Update if moved by 10 meters
        },
        (newLocation) => {
          console.log('Location updated:', newLocation);
          setUserLocation(newLocation);
        }
      );
    }

    getCurrentLocation();
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      // Animate to the new location
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,  // Zoomed in closer for better precision
        longitudeDelta: 0.01,
      }, 1000); // Animation duration in ms
    }
  }, [userLocation]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: 6.465422,  // Default latitude (Lagos)
          longitude: 3.406448, // Default longitude (Lagos)
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        // userLocationIndicator prop removed because it's not supported by MapView
        followsUserLocation={true}
      >
        {userLocation && (
          <MarkerPuck userLocation={userLocation} image={data.photo}/>
        )}
      </MapView>
    </View>
  );
};

export default LocationScreen;