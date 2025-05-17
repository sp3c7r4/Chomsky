import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Pressable, StyleSheet, Text } from "react-native";
import { io } from "socket.io-client";
import * as FileSystem from "expo-file-system";
import { View } from "react-native";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import {
  useAudioRecorder,
  useAudioPlayer,
  AudioModule,
  RecordingPresets,
  useAudioPlayerStatus,
  AudioPlayer,
} from "expo-audio";
import { colors, fontsizes, speechSet } from "@/constants";
import LottieView from "lottie-react-native";
import Mastra from "@/utils/Mastra";
import axios from "axios";
import { Audio } from "expo-av";

const data = {
  id: "01JQ0DAG9J05S6CDKSS8C405HF",
  firstname: "Spectra",
  lastname: "Gee",
  email: "spectragee@gmail.com",
  createdAt: "2025-03-23 03:29:16.212+01",
  updatedAt: "2025-03-23 03:29:16.212+01",
};

const chomsky = () => {
  const [sound, setSound] = useState("");
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uri, setUri] = useState<string | undefined | null>();

  const greeting = useAudioPlayer(speechSet.greeting);
  const nanSpeech = useAudioPlayer(speechSet.nanSpeech);

  const socket = io("http://172.20.10.6:3000");

  // function playAudio(audio: AudioPlayer) {
  //   audio.play()
  //   animationRef.current?.play()

  //   setTimeout(() => {
  //     animationRef.current??.pause()
  //   }, 5500)
  // }

  async function playAudio(audio: AudioPlayer) {
    // Play animation when audio starts
    animationRef.current?.play();
    // Play audio
    const { sound: soundObject } = await Audio.Sound.createAsync(audio, {
      shouldPlay: true,
    });

    // Pause animation when audio finishes
    soundObject.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        animationRef.current?.pause();
        soundObject.unloadAsync();
      }
    });
  }

  {
    /** Side Effects */
  }
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  useEffect(() => {
    playAudio(speechSet.greeting);
  }, []);

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
  {
    /** End of Side Effects */
  }

  function firstGreeting() {
    animationRef.current?.play();
    greeting.play();
    animationRef.current?.pause();
    // console.log(duration)
    // setTimeout(() => {
    // }, 5500);
  }

  // toggleAnimation()

  const startRecording = async () => {
    console.log("Recording started!!!");
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  // let player;
  // if(uri) {
  //   player = useAudioPlayer({ uri });
  // }
  const stopRecording = async () => {
    console.log("Recording stopped");
    await audioRecorder.stop();
    // await axios.get('https://mainly-destined-marmot.ngrok-free.app/')
    // await Mastra.voiceOutput(sound, setSound)
    setIsRecording(false);

    const uri = audioRecorder.uri;
    console.log(uri);
    setUri(`file://${uri}`);

    // First check if the file exists and get its info
    const fileInfo = await FileSystem.getInfoAsync(`file://${uri}`, {
      size: true,
    });
    console.log("FILE INFO: ", fileInfo);

    if (!fileInfo.exists) {
      console.error(`File does not exist at: ${uri}`);
      return;
    }

    console.log(`File exists at ${uri}, size: ${fileInfo.size} bytes`);
    console.log(fileInfo.uri);
    if (fileInfo.uri) {
      console.log("Seen");
      const fileBase64 = await FileSystem.readAsStringAsync(fileInfo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Mastra.voiceInput(fileInfo.uri)

      socket.emit("uploadAudio", {
        file: fileBase64,
        fileName: `${Date.now()}.m4a`,
        id: data.id,
      });

      socket.on("audioResponse", async (message) => {
        console.log(message);
        await Mastra.voiceOutput(message, sound, setSound);
      });

      socket.on("invalidSpeech", async (data) => {
        console.log(data);
        playAudio(require("@/assets/audio/nanSpeech.mp3"));
        // playAudio(nanSpeech)
        // const { sound: soundObject, status } = await Audio.Sound.createAsync(
        // require('@/assets/audio/nanSpeech.mp3'),
        // { shouldPlay: true })
        // // console.log(data)
        // // playAudio(greeting)
        // await soundObject.playAsync()
      });
      // async (response: any) => {
      //   const message = response.message
      //   if (response.success) {
      //     console.log("Audio Success")
      //     console.log(message)
      //     switch (message) {
      //       case 'invalidSpeech':
      //         playAudio(nanSpeech)
      //         break;

      //       default:
      //         console.log("In Default")
      //         await Mastra.voiceOutput(message, sound, setSound)
      //         // await Mastra.voiceOutput(message)
      //         break;
      //     }
      //     console.log('Audio file sent successfully via socket', 'MSG: '+ response?.message);
      //   } else {
      //     console.error('Failed to send audio file via socket', response.error);
      //   }
      // });
    } else {
      console.error("Recording URI is null or undefined");
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

  const player = useAudioPlayer({
    uri: "file:///data/user/0/host.exp.exponent/cache/output.mp3",
  });
  function playLocalSound() {
    player.play();
  }

  return (
    <SafeAreaView style={[styles.container, { position: "relative" }]}>
      <View style={{ height: "20%" }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>
          <Text
            style={{ fontFamily: "Satoshi-Bold", fontSize: fontsizes.heading2 }}
          >
            Hello, Satar!{"\n"}
          </Text>
          <Text
            style={{
              fontFamily: "Satoshi-Medium",
              color: "rgba(255,255,255,0.2)",
              fontSize: fontsizes.button,
            }}
          >
            Go ahead, I’m listening
          </Text>
        </Text>
      </View>
      {/* Chomsky Mascot 🤩 */}
      <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
        <View>
          <Image
            source={require("@/assets/images/chomsky_mute.png")}
            resizeMode="contain"
            style={{ width: "auto", height: 250, zIndex: 1 }}
          />
          <LottieView
            ref={animationRef}
            style={{
              width: "30%",
              height: "30%",
              position: "absolute",
              zIndex: 20,
              bottom: 40,
              alignSelf: "center",
            }}
            loop={true}
            speed={2.2}
            source={require("@/assets/lottie/talking.json")}
          />
          <View
            style={{
              width: "100%",
              flex: 1,
              zIndex: 10,
              bottom: 70,
              position: "absolute",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/cloud.png")}
              resizeMode="contain"
              style={{ width: 70, height: 50, marginLeft: 20 }}
            />
            <Image
              source={require("@/assets/images/cloud.png")}
              resizeMode="contain"
              style={{
                transform: [{ scaleX: -1 }],
                marginTop: 100,
                width: 70,
                height: 50,
                marginRight: 20,
              }}
            />
          </View>
        </View>
      </Pressable>
      {/* <FloatingImage source={require('@/assets/images/cloud.png')} style={{ left: "10%",width: 100, height: 50 }} /> */}
      <View style={{ position: "absolute" }}></View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
