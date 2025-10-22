import React, { useState, useRef,useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [savedConfirmation, setSavedConfirmation] = useState(false);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
      await AsyncStorage.setItem('ultimaFoto', data.uri);

      setSavedConfirmation(true);
      setTimeout(() => setSavedConfirmation(false), 2000);
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

      {/* Mensaje / icono de confirmación */}
      {savedConfirmation && (
        <View style={styles.confirmation}>
          <Text style={styles.confirmationText}>✅ Foto guardada</Text>
        </View>
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
  confirmation: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  confirmationText: {
    color: '#fff',
    fontSize: 16,
  },
});
