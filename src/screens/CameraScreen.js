import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { loadHistory, saveHistory, saveCompat } from '../storage/historyStorage';
import HistoryList from '../components/HistoryList';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [savedConfirmation, setSavedConfirmation] = useState(false);
  const [photoDate, setPhotoDate] = useState(null);
  const [history, setHistory] = useState([]);
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');

  useEffect(() => {
    (async () => {
      const h = await loadHistory();
      setHistory(h);
    })();
  }, []);

  const saveToHistory = async (uri, date) => {
    try {
      const newEntry = { uri, date };
      const newHistory = [newEntry, ...history].slice(0, 3);
      setHistory(newHistory);
      await saveHistory(newHistory);
      await saveCompat(uri, date); // compatibilidad con keys antiguas
    } catch (err) {
      console.error('Error guardando historial:', err);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      const now = new Date().toLocaleString();
      setPhoto(data.uri);
      setPhotoDate(now);
      await saveToHistory(data.uri, now);

      setSavedConfirmation(true);
      setTimeout(() => setSavedConfirmation(false), 2000);
    }
  };

  const toggleCameraType = () => setFacing((p) => (p === 'back' ? 'front' : 'back'));
  const toggleFlash = () => setFlash((p) => (p === 'off' ? 'on' : 'off'));

  if (!permission) return <Text>Cargando permisos...</Text>;
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

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {!photo ? (
        <>
          <CameraView style={{ flex: 1 }} ref={cameraRef} facing={facing} flash={flash} />

          <View style={styles.navbar}>
            <TouchableOpacity style={styles.navButton} onPress={toggleFlash}>
              <MaterialIcons name={flash === 'off' ? 'flash-off' : 'flash-on'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <HistoryList
              history={history}
              onSelect={(uri, date) => {
                setPhoto(uri);
                setPhotoDate(date);
              }}
            />

            <TouchableOpacity style={styles.shutterButton} onPress={takePicture} />

            <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
              <MaterialIcons name={facing === 'back' ? 'camera-rear' : 'camera-front'} size={30} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Image source={{ uri: photo }} style={{ flex: 1 }} />
          {photoDate && <Text style={styles.photoDate}>📅 {photoDate}</Text>}

          {savedConfirmation && (
            <View style={styles.confirmation}>
              <Text style={styles.confirmationText}>✅ Foto guardada</Text>
            </View>
          )}

          <View style={styles.footerPreview}>
            <TouchableOpacity style={styles.bigButton} onPress={() => setPhoto(null)}>
              <Text style={styles.buttonText}>Volver a cámara</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: { position: 'absolute', top: 40, left: 0, right: 0, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 20, zIndex: 10 },
  navButton: { backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  footer: { position: 'absolute', bottom: 25, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  shutterButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', borderWidth: 4, borderColor: '#999' },
  toggleButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  confirmation: { position: 'absolute', top: 40, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, zIndex: 10 },
  confirmationText: { color: '#fff', fontSize: 16 },
  footerPreview: { padding: 16, backgroundColor: 'black' },
  bigButton: { backgroundColor: 'white', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', alignSelf: 'center', minWidth: 200, marginTop: 8 },
  buttonText: { color: 'black', fontSize: 18, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoDate: { position: 'absolute', bottom: 90, left: 20, color: 'white', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});