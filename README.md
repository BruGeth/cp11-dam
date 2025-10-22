# CameraApp

Aplicación React Native (Expo) para capturar fotos y mantener un historial local de imágenes.

## Resumen
CameraApp usa Expo y expo-camera para tomar fotos y @react-native-async-storage/async-storage para guardar un historial simple de capturas. Código organizado en src/components, src/screens y src/storage.

## Dependencias clave (desde package.json)
- expo ~54.0.18
- react 19.1.0
- react-native 0.81.5
- expo-camera ^17.0.8
- @react-native-async-storage/async-storage ^2.2.0
- @expo/vector-icons

## Estructura
- src/
  - components/HistoryList.js
  - screens/CameraScreen.js
  - storage/historyStorage.js

## Requisitos
- Node.js (>= 16)
- npm o yarn
- Expo CLI (opcional): npm install -g expo-cli
- Emulador Android / dispositivo con Expo Go (Android/iOS)

## Instalación y ejecución (Windows)
1. Abrir PowerShell en la carpeta del proyecto:
   cd C:\Users\Brunoo\Documents\ReactNativeProjects\CameraApp
2. Instalar dependencias:
    ```
    npm install
    ```
3. Iniciar Metro / Expo:
   - npm start
4. Comandos útiles (desde package.json):
   - npm run android  -> abre el proyecto en Android (expo start --android)
   - npm run ios      -> abre el proyecto en iOS (expo start --ios)
   - npm run web      -> abre en web (expo start --web)
5. En un dispositivo físico: escanear el QR con Expo Go.

## Permisos
La app solicita permisos de cámara en tiempo de ejecución (expo-camera). Asegurarse de aceptar los permisos en el emulador/dispositivo.

## Notas de desarrollo
- El historial se guarda localmente en src/storage/historyStorage.js usando AsyncStorage. Cambiar a filesystem si necesita persistencia de archivos reales.
- Componentes UI en src/components. Pantalla principal: src/screens/CameraScreen.js.
- Para debugging: usar React Native Debugger / consola de Expo.
