import React, { useState, useRef,useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const savedPhoto = await AsyncStorage.getItem('ultimaFoto');
      if (savedPhoto) setPhoto(savedPhoto);
    })();
  }, []);

  if (hasPermission === null) return <Text>Solicitando permiso...</Text>;
  if (hasPermission === false) return <Text>Permiso denegado</Text>;

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      {!photo ? (
        <Camera style={{ flex: 1 }} ref={cameraRef} />
      ) : (
        <Image source={{ uri: photo }} style={{ flex: 1 }} />
      )}
      <Button
        title={photo ? "Volver a cámara" : "Tomar foto"}
        onPress={() => (photo ? setPhoto(null) : takePicture())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
