import React, { useState, useRef,useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');

    const savedPhoto = await AsyncStorage.getItem('ultimaFoto');
    if (savedPhoto) setPhoto(savedPhoto);
  })();
}, []);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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
