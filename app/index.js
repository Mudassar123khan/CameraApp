// Starter React Native (Expo) App for Smart Camera Assistant

import { Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [environmentInfo, setEnvironmentInfo] = useState(null);
  const [styleInput, setStyleInput] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const analyzeEnvironment = () => {
    // Dummy environment data
    const brightness = Math.floor(Math.random() * 100);
    const suggestion = generateSettings(brightness, styleInput);
    setEnvironmentInfo({ brightness, ...suggestion });
  };

  const generateSettings = (brightness, style) => {
    let ISO, shutterSpeed, whiteBalance, exposure;

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

  if (hasPermission === null) {
    return (
      <View style={styles.centered}><Text>Requesting permission...</Text></View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}><Text>No access to camera</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
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
