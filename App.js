import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [savedConfirmation, setSavedConfirmation] = useState(false);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back'); // 'front' o 'back'

  useEffect(() => {
    (async () => {
      // Verificar si ya hay una foto guardada
      try {
        const savedPhoto = await AsyncStorage.getItem('ultimaFoto');
        if (savedPhoto) setPhoto(savedPhoto);
      } catch (err) {
        console.error('Error leyendo AsyncStorage:', err);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
      await AsyncStorage.setItem('ultimaFoto', data.uri);

      setSavedConfirmation(true);
      setTimeout(() => setSavedConfirmation(false), 2000);
    }
  };

  if (!permission) {
    return <Text>Cargando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>No tienes permiso para usar la cámara.</Text>
        <TouchableOpacity style={styles.bigButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Solicitar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={{ flex: 1 }}>
      {!photo ? (
        <CameraView style={{ flex: 1 }} ref={cameraRef} facing={facing} />
      ) : (
        <Image source={{ uri: photo }} style={{ flex: 1 }} />
      )}

      {savedConfirmation && (
        <View style={styles.confirmation}>
          <Text style={styles.confirmationText}>✅ Foto guardada</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
          <Text style={styles.buttonText}>Cambiar cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => (photo ? setPhoto(null) : takePicture())}
        >
          <Text style={styles.buttonText}>{photo ? 'Volver a cámara' : 'Tomar foto'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  footer: {
    padding: 16,
    backgroundColor: 'black',
    bottom: 30,
  },
  bigButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 200,
    marginTop: 8,
  },
  toggleButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 160,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
