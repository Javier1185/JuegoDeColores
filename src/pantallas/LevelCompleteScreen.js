/**
 * LevelCompleteScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de felicitación al completar un nivel.
 *  - Fondo: degradado oscuro azul/morado (más elegante que negro puro)
 *  - Tarjeta: blanca con borde dorado animado + confeti cayendo
 *  - Botón: textura de madera verde (igual que "Jugar" en Home)
 *  - Estrellas: aparecen en secuencia con efecto pop
 *  - Tarjeta: animación de entrada pop+fade
 * -----------------------------------------------------------------------
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import StarsAnimated from '../components/feedback/StarsAnimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// -----------------------------------------------------------------
// Pieza de confeti individual
// -----------------------------------------------------------------
const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

function ConfettiPiece({ color, startX, delay, duration, size }) {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Caída principal
    Animated.timing(fallAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();

    // Rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600 + Math.random() * 400,
        useNativeDriver: true,
      })
    ).start();

    // Movimiento lateral suave (balanceo)
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, SCREEN_HEIGHT * 0.75],
  });

  const opacity = fallAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateX = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-15, 15],
  });

  // Alternar entre círculo y cuadrado para más variedad
  const isCircle = Math.random() > 0.5;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: isCircle ? size / 2 : 2,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  );
}

// -----------------------------------------------------------------
// Efecto de confeti completo
// -----------------------------------------------------------------
function ConfettiEffect() {
  const pieces = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      key: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      startX: Math.random() * SCREEN_WIDTH,
      delay: Math.random() * 600,
      duration: 1800 + Math.random() * 1200,
      size: 7 + Math.random() * 7,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {pieces.map((p) => (
        <ConfettiPiece key={p.key} {...p} />
      ))}
    </View>
  );
}

// -----------------------------------------------------------------
// Botón con textura de madera verde (igual que "Jugar" en Home)
// -----------------------------------------------------------------
function WoodButtonGreen({ label, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }),
      Animated.timing(translateYAnim, { toValue: 3, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 10 }),
      Animated.timing(translateYAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
      style={styles.woodBtnTouchable}
    >
      <Animated.View
        style={[
          styles.woodBtnWrapper,
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
        ]}
      >
        <View style={styles.woodBtnShadow} />
        <LinearGradient
          colors={['#5FD97A', '#3BAE52', '#2D8C40']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.woodBtnGradient}
        >
          <View style={[styles.veta, { top: '20%', opacity: 0.08 }]} />
          <View style={[styles.veta, { top: '50%', opacity: 0.06 }]} />
          <View style={[styles.veta, { top: '75%', opacity: 0.05 }]} />
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.woodBtnGloss}
          />
          <Text style={styles.woodBtnText}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

// -----------------------------------------------------------------
// Pantalla principal
// -----------------------------------------------------------------
export default function LevelCompleteScreen({ route, navigation }) {
  const { level, stars = 0, isLastLevel = false, coloresUsados = [] } =
    route.params ?? {};

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada de la tarjeta
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 12,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulso del borde dorado
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(borderAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFD700', '#FFF176'],
  });

  const handleContinue = () => {
    if (isLastLevel) {
      navigation.navigate(SCREENS.GAME_FINISHED, { stars });
    } else {
      navigation.navigate(SCREENS.GAME, {
        level: level + 1,
        stars,
        coloresUsados, // historial de colores para no repetir
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo: degradado oscuro azul-morado */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Confeti cayendo por encima del fondo pero debajo de la tarjeta */}
      <ConfettiEffect />

      {/* Tarjeta central */}
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View style={[styles.card, { borderColor }]}>
          {/* Borde interior dorado brillante */}
          <LinearGradient
            colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.05)']}
            style={StyleSheet.absoluteFillObject}
          />

          <StarsAnimated earnedCount={3} size={52} />

          <Text style={styles.title}>¡Excelente!</Text>
          <Text style={styles.subtitle}>Nivel {level} completado</Text>
          <Text style={styles.starsCount}>⭐ {stars} {stars === 1 ? 'estrella' : 'estrellas'}</Text>

          <WoodButtonGreen
            label={isLastLevel ? 'Ver resultado final' : 'Siguiente Nivel →'}
            onPress={handleContinue}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '88%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: '#2D8C40',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: PALETTE.textDark,
    marginBottom: 4,
    fontWeight: '600',
  },
  starsCount: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: '#E6A800',
    marginBottom: 24,
  },

  // Botón madera verde
  woodBtnTouchable: {
    width: '100%',
  },
  woodBtnWrapper: {
    width: '100%',
    borderRadius: 16,
  },
  woodBtnShadow: {
    position: 'absolute',
    bottom: -5,
    left: 4,
    right: 4,
    height: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: -1,
  },
  woodBtnGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  woodBtnGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  veta: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  woodBtnText: {
    color: '#FFF',
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});