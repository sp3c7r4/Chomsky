import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// import { Audio } from 'expo-av'
import { Button, Image, Platform, Pressable, StyleSheet, Text } from 'react-native';
import {io} from 'socket.io-client'
import * as FileSystem from 'expo-file-system';
import { View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { useAudioRecorder, useAudioPlayer , AudioModule, RecordingPresets, useAudioPlayerStatus } from 'expo-audio';
import { colors, fontsizes } from '@/constants';
import LottieView from 'lottie-react-native';


const chomsky = () => {
  const [sound, setSound] = useState();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uri, setUri] = useState<string | undefined | null>()
  
  const greetingAudio = require('@/assets/audio/greeting.mp3')
  const greeting = useAudioPlayer(greetingAudio)

  const socket = io("http://172.20.10.4:3000");

{/** Side Effects */}
    useEffect(() => {
      (async () => {
          const status = await AudioModule.requestRecordingPermissionsAsync();
          if (!status.granted) {
            Alert.alert('Permission to access microphone was denied');
          }
        })();
      }, []);
      
      useEffect(() => {
        console.log(uri)
      },[uri])
      
    useEffect(() => {
      greeting.play()
      toggleAnimation()
      // console.log(duration)
      setTimeout(() => {
        animationRef.current?.pause()
      }, 5500)
    }, [])

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
    greeting.play()
    toggleAnimation()
    // console.log(duration)
    setTimeout(() => {
      animationRef.current?.pause()
    }, 5500)
  }
  // toggleAnimation()
  
  const startRecording = async () => {
    console.log("Recording started!!!")
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };
  
  // let player;
  // if(uri) {
    //   player = useAudioPlayer({ uri });
    // }
  const stopRecording = async () => {
    console.log("Recording stopped")
    await audioRecorder.stop();
    setIsRecording(false);

    const uri = audioRecorder.uri
    console.log(uri)
    setUri(`file://${uri}`)

    if (!uri) {
      console.error('Recording URI is null or undefined');
      return;
    }

    // First check if the file exists and get its info
    const fileInfo = await FileSystem.getInfoAsync(`file://${uri}`, {size: true});
    console.log("FILE INFO: ", fileInfo)
    
    if (!fileInfo.exists) {
      console.error(`File does not exist at: ${uri}`);
      return;
    }
    
    console.log(`File exists at ${uri}, size: ${fileInfo.size} bytes`);
    console.log(fileInfo.uri)
    if (fileInfo.uri) {
      console.log("Seen")
      const fileBase64 = await FileSystem.readAsStringAsync(fileInfo.uri, { encoding: FileSystem.EncodingType.Base64 });
      console.log(fileBase64)
      console.log("Hello audio");
      
      socket.emit('upload', { file: fileBase64, fileName: `${Date.now()}.m4a` }, (response: any) => {
        if (response.success) {
          console.log('Audio file sent successfully via socket');
        } else {
          console.error('Failed to send audio file via socket', response.error);
        }
      });
    } else {
      console.error('Recording URI is null or undefined');
    }
    // if (audioRecorder.uri) {
    //   const fileUri = audioRecorder.uri;
    //   const fileInfo = await FileSystem.getInfoAsync(fileUri);
    //   if (fileInfo.exists) {
    //     console.log(audioRecorder?.uri)
    //   } else {
    //     console.error("File does not exist at the specified URI");
    //   }
    // }
    
      
    // const player = useAudioPlayer({ uri: audioRecorder.uri });
    // // playSound(audioRecorder.uri)
    // await player.play()
  };

  const shareAudio = async (fileUri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "File not found. Cannot share.");
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this platform.");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'audio/m4a', // Or 'audio/mp4' as m4a is a container based on MPEG-4 Part 14
        dialogTitle: 'Share this audio recording',
        UTI: 'com.apple.m4a-audio', // For iOS if needed, though mimeType is often enough
      });
    } catch (error: any) {
      console.error('Error sharing file:', error);
      Alert.alert("Error", "Could not share the file: " + error.message);
    }
  };


  
  return (
    <SafeAreaView style={[styles.container, {position: "relative"}]}>
      <View style={{height: "20%"}}>
        <Text style={{color: "#fff", textAlign: "center"}}>
          <Text style={{fontFamily: "Satoshi-Bold", fontSize: fontsizes.heading2}}>Hello, Satar!{"\n"}</Text>
          <Text style={{fontFamily: "Satoshi-Medium",color: "rgba(255,255,255,0.2)", fontSize: fontsizes.button}}>Go ahead, I’m listening</Text>
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