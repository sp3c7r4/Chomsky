import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av'
import { Button, Image, Platform, Pressable, StyleSheet, Text } from 'react-native';
import {io} from 'socket.io-client'
import * as FileSystem from 'expo-file-system';
import { View } from 'react-native';
import { Alert } from 'react-native';
import { useAudioRecorder,useAudioPlayer , AudioModule, RecordingPresets, useAudioPlayerStatus } from 'expo-audio';
import { colors, fontsizes } from '@/constants';
import LottieView from 'lottie-react-native';


const chomsky = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const greetingAudio = require('@/assets/audio/greeting.mp3')
  const [greeted, setGreeted] = useState(false)
  const [isRecording, setIsRecording] = useState(false);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uri, setUri] = useState<string | undefined | null>()
  const greeting = useAudioPlayer(greetingAudio)
  const socket = io("http://192.168.43.54:3000");

  const [greetingSound, setGreetingSound] = useState<Audio.Sound | null>(null);

{/** Side Effects */}
    useEffect(() => {
      (async () => {
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (!permissionResponse.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
      
      // Set audio mode for both recording and playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    })();
      }, []);
      
    useEffect(() => {
      console.log(uri)
    },[uri])
      
    useEffect(() => {

      (async function() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/greeting.mp3')
        );
        setGreetingSound(sound);
      } catch (error) {
        console.error("Error loading greeting sound:", error);
      }
    })()
    
    // Cleanup
    return () => {
      if (greetingSound) {
        greetingSound.unloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
    }, [])

     useEffect(() => {
      if (!greeted) {
        firstGreeting();
        setGreeted(true);
      }
    }, [greeted, greetingSound]);

    useEffect(() => {
      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      return () => {
        socket.disconnect();
      };
    }, []);
{/** End of Side Effects */}

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
  
  function firstGreeting() {
    if (greetingSound) {
      greetingSound.playAsync();
      toggleAnimation();
      setTimeout(() => {
        animationRef.current?.pause();
      }, 5500);
    }
  }
  // toggleAnimation()
  
  const startRecording = async () => {
    try {
      // Ensure old recording is unloaded
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      console.log('Starting recording...');
      
      // Use high quality recording options
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      };
      
      // Create new recording
      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };
  
  // let player;
  // if(uri) {
    //   player = useAudioPlayer({ uri });
    // }
  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      
      if (!recording) {
        console.log('No active recording');
        setIsRecording(false);
        return;
      }
      
      // Stop the recording
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      
      // Get the recorded URI
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      
      if (!uri) {
        console.error('Recording URI is null or undefined');
        return;
      }
      
      console.log('Recording URI:', uri);
      
      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      if (!fileInfo.exists) {
        console.error(`File does not exist at: ${uri}`);
        return;
      }
      
      console.log(`File exists, size: ${fileInfo.size} bytes`);
      
      try {
        // Try playing back the recording
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setSound(newSound);
        
        // Read file as base64 for sending to server
        const fileBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        console.log(`File read as base64, length: ${fileBase64.length}`);
        
        // Send to server
        socket.emit('upload', {
          file: fileBase64,
          fileName: 'Recording.m4a'
        }, (response) => {
          if (response && response.success) {
            console.log('Audio file sent successfully via socket');
          } else {
            console.error('Failed to send audio file via socket', 
              response?.error || 'No response from server');
          }
        });
        
      } catch (error) {
        console.error('Error playing or sending recording:', error);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };


  
  return (
    <SafeAreaView style={[styles.container, {position: "relative"}]}>
      <View style={{height: "20%"}}>
        <Text style={{color: "#fff", textAlign: "center"}}>
          <Text style={{fontFamily: "Satoshi-Bold", fontSize: fontsizes.heading2}}>Hello, Satar!{"\n"}</Text>
          <Text style={{fontFamily: "Satoshi-Bold",color: "rgba(255,255,255,0.2)", fontSize: fontsizes.button}}>Go ahead, I’m listening</Text>
        </Text>
      </View>
      {/* Chomsky Mascot 🤩 */}
      <Pressable
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <View>
          <Image source={require('@/assets/images/chomsky_mute.png')} resizeMode='contain' style={{width: "auto", height: 250, zIndex: 1}}/>
          <LottieView
              ref={animationRef}
              style={{ width: '30%', height: '30%',position: "absolute", zIndex: 20, bottom: 40, alignSelf: "center" }}
              loop={true}
              speed={2.2}
              source={require('@/assets/lottie/talking.json')}
          />
          <View style={{width: "100%", flex:1, zIndex: 10,bottom: 70, position: "absolute", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Image source={require('@/assets/images/cloud.png')} resizeMode='contain' style={{width: 70, height: 50, marginLeft: 20}}/>
            <Image source={require('@/assets/images/cloud.png')} resizeMode='contain' style={{transform: [{scaleX: -1}], marginTop: 100, width: 70, height: 50, marginRight: 20}}/>
          </View>
        </View>
      </Pressable>
        {/* <FloatingImage source={require('@/assets/images/cloud.png')} style={{ left: "10%",width: 100, height: 50 }} /> */}
      <View style={{position: "absolute"}}>
      </View>
      {/* <Button title='talk' onPress={toggleAnimation}/> */}
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