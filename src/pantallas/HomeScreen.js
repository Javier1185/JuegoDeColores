/**
 * HomeScreen.js
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import ScreenBackground from '../components/common/ScreenBackground';
import { reproducirSonidoBoton } from '../utils/sonidoBoton';

function WoodButton({ label, onPress, colors }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(translateYAnim, {
        toValue: 3,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (event) => {
    reproducirSonidoBoton();
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
      style={styles.woodButtonTouchable}
    >
      <Animated.View
        style={[
          styles.woodButtonWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        <View style={styles.woodButtonShadowBottom} />
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.woodButtonGradient}
        >
          <View style={[styles.veta, { top: '20%', opacity: 0.08 }]} />
          <View style={[styles.veta, { top: '45%', opacity: 0.06 }]} />
          <View style={[styles.veta, { top: '70%', opacity: 0.05 }]} />
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.woodButtonGloss}
          />
          <Text style={styles.woodButtonText}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <ScreenBackground
      source={require('../../assets/images/backgrounds/home-background.jpeg')}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.buttonsContainer}>
          <WoodButton
            label="Jugar"
            colors={['#5FD97A', '#3BAE52', '#2D8C40']}
            onPress={() => navigation.navigate(SCREENS.GAME, { level: 1, stars: 0 })}
          />
          <WoodButton
            label="Cómo jugar"
            colors={['#C8884E', '#A0622A', '#7A4A1E']}
            onPress={() => navigation.navigate(SCREENS.HOW_TO_PLAY)}
          />
          <WoodButton
            label="Créditos"
            colors={['#C8884E', '#A0622A', '#7A4A1E']}
            onPress={() => navigation.navigate(SCREENS.CREDITS)}
          />
          <WoodButton
            label="Configuración"
            colors={['#A0622A', '#7A4A1E', '#5C3514']}
            onPress={() => navigation.navigate(SCREENS.SETTINGS)}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',   // botones hacia abajo, logo arriba
    alignItems: 'center',
    paddingBottom: 60,
  },
  logo: {
    position: 'absolute',
    top: '5%',
    width: '90%',
    height: 280,
    alignSelf: 'center',
  },
  buttonsContainer: {
    width: '88%',
    gap: 12,
  },
  woodButtonTouchable: {
    width: '100%',
  },
  woodButtonWrapper: {
    width: '100%',
    borderRadius: 18,
  },
  woodButtonShadowBottom: {
    position: 'absolute',
    bottom: -5,
    left: 4,
    right: 4,
    height: '100%',
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: -1,
  },
  woodButtonGradient: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',        // texto centrado
    justifyContent: 'center',
  },
  woodButtonGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  veta: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  woodButtonText: {
    color: '#FFF',
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});