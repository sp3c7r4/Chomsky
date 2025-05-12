import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av'
import { Button, Image, StyleSheet } from 'react-native';
import {io} from 'socket.io-client'
import * as FileSystem from 'expo-file-system';
import { View } from 'react-native';
import { Alert } from 'react-native';
import { useAudioRecorder,useAudioPlayer , RecordingOptions, AudioModule, RecordingPresets } from 'expo-audio';
import { colors } from '@/constants';
import Blob from '@/components/Blob';
import FloatingImage from '@/components/FloatingCloud';
import LottieView from 'lottie-react-native';

const chomsky = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uri, setUri] = useState("")

  const playAudio = async () => {
    if (uri) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } else {
      Alert.alert('No audio file to play');
    }
  };

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    setIsRecording(false);
    setUri(audioRecorder?.uri)
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);

  function toggleAnimation() {
    if (isPlaying) {
      // If animation is playing, stop it
      animationRef.current?.pause();
      setIsPlaying(false);
    } else {
      // If animation is stopped, play it
      animationRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {position: "relative"}]}>

      {/* <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : record}
      />
      <Button title="Play Sound" onPress={playAudio} /> */}
      {/* <Blob/> */}
      <View>
        <Image source={require('@/assets/images/chomsky_mute.png')} resizeMode='contain' style={{width: "auto", height: 250, zIndex: 1}}/>
        <LottieView
            ref={animationRef}
            style={{ width: '30%', height: '30%',position: "absolute", zIndex: 20, bottom: 40, alignSelf: "center" }}
            loop={true}
            speed={2.2}
            source={require('@/assets/lottie/talking.json')}
        />
      </View>
        {/* <FloatingImage source={require('@/assets/images/cloud.png')} style={{ left: "10%",width: 100, height: 50 }} /> */}
        <View style={{width: "100%", flex:1, zIndex: 10, position: "absolute", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <Image source={require('@/assets/images/cloud.png')} resizeMode='contain' style={{width: 70, height: 50, marginLeft: 20}}/>
          <Image source={require('@/assets/images/cloud.png')} resizeMode='contain' style={{transform: [{scaleX: -1}], marginTop: 100, width: 70, height: 50, marginRight: 20}}/>
        </View>
      <View style={{position: "absolute"}}>
      </View>
      <Button title='talk' onPress={toggleAnimation}/>
      <StatusBar style='auto'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.light.background_black,
    padding: 10,
  },
});
// const chomsky = () => {
//   const [recording, setRecording] = useState<Audio.Recording|undefined>();
//   const [permissionResponse, requestPermission] = Audio.usePermissions();
//   const socket = io("http://172.20.10.3:3000");
  
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from socket server");
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   async function startRecording() {
//     try {
//       if (!permissionResponse || permissionResponse.status !== 'granted') {
//         console.log('Requesting permission..');
//         await requestPermission();
//       }
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       console.log('Starting recording..');
//       const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       console.log('Recording started');
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   }

//   async function stopRecording() {
//     console.log('Stopping recording..');
//     setRecording(undefined);
//     await recording?.stopAndUnloadAsync();
//     await Audio.setAudioModeAsync(
//       {
//         allowsRecordingIOS: false,
//       }
//     );
//     const uri = recording?.getURI();
//     if (uri) {
//       console.log("Hello audio");
//       const fileBase64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

//       socket.emit('upload', { file: fileBase64, fileName: 'Recording.m4a' }, (response: any) => {
//         if (response.success) {
//           console.log('Audio file sent successfully via socket');
//         } else {
//           console.error('Failed to send audio file via socket', response.error);
//         }
//       });
//     } else {
//       console.error('Recording URI is null or undefined');
//     }
//     console.log('Recording stopped and stored at', uri);
//   }

//   return (
//     <SafeAreaView style={{backgroundColor: "#000", flex:1}}>
//       <StatusBar style={"auto"}/>
//       <Button
//         title={recording ? 'Stop Recording' : 'Start Recording'}
//         onPress={recording ? stopRecording : startRecording}
//       />
//     </SafeAreaView>
//   )
// }

export default chomsky;