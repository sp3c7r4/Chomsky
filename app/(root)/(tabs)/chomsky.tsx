import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av'
import { Button } from 'react-native';
import {io} from 'socket.io-client'
import * as FileSystem from 'expo-file-system';

const chomsky = () => {
  const [recording, setRecording] = useState<Audio.Recording|undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const socket = io("http://172.20.10.3:3000");
  
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

  async function startRecording() {
    try {
      if (!permissionResponse || permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording?.getURI();
    if (uri) {
      console.log("Hello audio");
      const fileBase64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      socket.emit('upload', { file: fileBase64, fileName: 'Recording.m4a' }, (response: any) => {
        if (response.success) {
          console.log('Audio file sent successfully via socket');
        } else {
          console.error('Failed to send audio file via socket', response.error);
        }
      });
    } else {
      console.error('Recording URI is null or undefined');
    }
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <SafeAreaView style={{backgroundColor: "#000", flex:1}}>
      <StatusBar style={"auto"}/>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </SafeAreaView>
  )
}

export default chomsky;