// Starter React Native (Expo Router) App for Smart Camera Assistant (TypeScript Version)

import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define CameraType manually if not found in expo-camera
const CameraType = {
  front: 'front',
  back: 'back'
} as const;

type CameraFacing = typeof CameraType[keyof typeof CameraType];

export default function CameraAssistant() {
  const [permission, requestPermission] = useCameraPermissions();
  const [environmentInfo, setEnvironmentInfo] = useState<any>(null);
  const [styleInput, setStyleInput] = useState<string>('');
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const analyzeEnvironment = () => {
    const brightness = Math.floor(Math.random() * 100);
    const suggestion = generateSettings(brightness, styleInput);
    setEnvironmentInfo({ brightness, ...suggestion });
  };

  const generateSettings = (brightness: number, style: string) => {
    let ISO: number, shutterSpeed: string, whiteBalance: string, exposure: string;

    if (brightness < 30) {
      ISO = 800;
      shutterSpeed = '1/30';
    } else if (brightness > 70) {
      ISO = 100;
      shutterSpeed = '1/250';
    } else {
      ISO = 400;
      shutterSpeed = '1/100';
    }

    switch (style.toLowerCase()) {
      case 'cinematic':
        whiteBalance = 'warm';
        exposure = '-1 EV';
        break;
      case 'aesthetic':
        whiteBalance = 'cool';
        exposure = '+0.5 EV';
        break;
      default:
        whiteBalance = 'auto';
        exposure = '0 EV';
    }

    return { ISO, shutterSpeed, whiteBalance, exposure };
  };

  if (!permission) {
    return <View style={styles.centered}><Text>Requesting permission...</Text></View>;
  }

  if (!permission.granted) {
    return <View style={styles.centered}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={CameraType.back as CameraFacing} />
      <TextInput
        placeholder="Enter style (cinematic, aesthetic...)"
        style={styles.input}
        onChangeText={setStyleInput}
        value={styleInput}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={analyzeEnvironment}>
        <Text style={styles.buttonText}>Analyze Environment</Text>
      </TouchableOpacity>
      {environmentInfo && (
        <View style={styles.resultBox}>
          <Text>Brightness: {environmentInfo.brightness}</Text>
          <Text>ISO: {environmentInfo.ISO}</Text>
          <Text>Shutter Speed: {environmentInfo.shutterSpeed}</Text>
          <Text>White Balance: {environmentInfo.whiteBalance}</Text>
          <Text>Exposure: {environmentInfo.exposure}</Text>
        </View>
      )}
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '90%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#fff',
    width: '80%',
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    color: '#000',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    width: '80%',
  },
});
