/**
 * AppNavigator.js
 * -----------------------------------------------------------------------
 * Define el stack de navegación completo del juego.
 *
 * Flujo de pantallas:
 *   Splash -> Home -> (HowToPlay | Credits | Settings | Game)
 *   Game -> LevelComplete -> Game (siguiente nivel) ... -> GameFinished
 *   GameFinished -> Home
 *
 * Se usa @react-navigation/stack con animaciones tipo "fade" para las
 * transiciones, ya que se ven más suaves y amigables para niños que el
 * slide horizontal por defecto.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../pantallas/SplashScreen';
import HomeScreen from '../pantallas/HomeScreen';
import HowToPlayScreen from '../pantallas/HowToPlayScreen';
import CreditsScreen from '../pantallas/CreditsScreen';
import SettingsScreen from '../pantallas/SettingsScreen';
import GameScreen from '../pantallas/GameScreen';
import LevelCompleteScreen from '../pantallas/LevelCompleteScreen';
import GameFinishedScreen from '../pantallas/GameFinishedScreen';

// Nombres de ruta centralizados para evitar strings sueltos regados
// por todo el código (typos en navigation.navigate('Gaem') por ejemplo).
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
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREENS.SPLASH}
        screenOptions={{
          headerShown: false, // Sin header nativo: cada pantalla maneja su propio diseño
          gestureEnabled: false, // Evita que el niño "regrese" arrastrando por accidente
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress, // Transición tipo fade, suave para niños
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
        <Stack.Screen
          name={SCREENS.LEVEL_COMPLETE}
          component={LevelCompleteScreen}
        />
        <Stack.Screen
          name={SCREENS.GAME_FINISHED}
          component={GameFinishedScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
