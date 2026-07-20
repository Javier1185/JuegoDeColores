// IMPORTANTE: este import debe ser SIEMPRE la primera línea del archivo
// raíz para que react-native-gesture-handler funcione correctamente.
import 'react-native-gesture-handler';

import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import AppNavigator from './src/navegacion/AppNavigator';
import FONTS_TO_LOAD from './src/constantes/fuentes';
import useMusicaFondo from './src/hooks/useMusicaFondo';

// Evita que el splash nativo se oculte automáticamente antes de tiempo,
// le daremos control manual mientras cargamos fuentes y recursos.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Música de fondo manejada a nivel raíz de la app (no por pantalla).
  // Al vivir en App.js, que solo se monta una vez durante toda la sesión,
  // el audio sobrevive a la navegación entre pantallas y evita el corte
  // que ocurría con Expo Fast Refresh cuando el sonido vivía dentro de
  // un componente de pantalla que se remontaba.
  useMusicaFondo(0.35);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Carga todas las fuentes personalizadas definidas en constants/fonts.js
        await Font.loadAsync(FONTS_TO_LOAD);

        // Aquí se pueden precargar otros recursos pesados si se necesita
        // (ej. imágenes grandes) usando Asset.loadAsync de expo-asset.
      } catch (error) {
        console.warn('Error preparando la app:', error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  // Oculta el splash nativo justo cuando la vista raíz ya se pintó,
  // evitando el "flash" de pantalla blanca entre el splash y la app.
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <AppNavigator />
    </View>
  );
}