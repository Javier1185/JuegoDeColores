/**
 * AppNavigator.js
 * -----------------------------------------------------------------------
 * Define el stack de navegación completo del juego.
 *
 * La música de fondo se inicia aquí (una sola vez para toda la app)
 * usando el hook useMusicaFondo, así suena en todas las pantallas
 * sin interrumpirse al navegar entre ellas.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import useMusicaFondo from '../hooks/useMusicaFondo';

import SplashScreen from '../pantallas/SplashScreen';
import HomeScreen from '../pantallas/HomeScreen';
import HowToPlayScreen from '../pantallas/HowToPlayScreen';
import CreditsScreen from '../pantallas/CreditsScreen';
import SettingsScreen from '../pantallas/SettingsScreen';
import GameScreen from '../pantallas/GameScreen';
import LevelCompleteScreen from '../pantallas/LevelCompleteScreen';
import GameFinishedScreen from '../pantallas/GameFinishedScreen';

export const SCREENS = {
  SPLASH: 'Splash',
  HOME: 'Home',
  HOW_TO_PLAY: 'HowToPlay',
  CREDITS: 'Credits',
  SETTINGS: 'Settings',
  GAME: 'Game',
  LEVEL_COMPLETE: 'LevelComplete',
  GAME_FINISHED: 'GameFinished',
};

const Stack = createStackNavigator();

export default function AppNavigator() {
  // Inicia la música de fondo al montar el navigator (una sola vez)
  // Volumen 0.35 para que no tape los efectos de sonido del juego
  useMusicaFondo(0.35);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREENS.SPLASH}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        <Stack.Screen name={SCREENS.SPLASH} component={SplashScreen} />
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
        <Stack.Screen name={SCREENS.HOW_TO_PLAY} component={HowToPlayScreen} />
        <Stack.Screen name={SCREENS.CREDITS} component={CreditsScreen} />
        <Stack.Screen name={SCREENS.SETTINGS} component={SettingsScreen} />
        <Stack.Screen name={SCREENS.GAME} component={GameScreen} />
        <Stack.Screen name={SCREENS.LEVEL_COMPLETE} component={LevelCompleteScreen} />
        <Stack.Screen name={SCREENS.GAME_FINISHED} component={GameFinishedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}