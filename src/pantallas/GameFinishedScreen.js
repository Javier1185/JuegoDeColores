/**
 * GameFinishedScreen.js
 * -----------------------------------------------------------------------
 * Pantalla final que aparece cuando el jugador completa TODOS los
 * niveles del juego.
 *
 * Version "llena de vida": cielo con degradado, rayos de sol girando
 * detras de la copa, estrellas titilando por toda la pantalla, un
 * estallido de chispas al entrar, titulo con letras que rebotan una
 * por una, confeti + globos + emojis flotando, y un boton con borde
 * arcoiris animado.
 *
 * No depende de librerias externas (solo React Native core), para que
 * funcione sin instalar nada nuevo. Si ya tienes expo-linear-gradient
 * o react-native-linear-gradient en tu proyecto, se puede cambiar el
 * fondo por un degradado real y mas suave (avisame).
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Colores nuevos solo para la celebracion (confeti / brillo / globos / rayos).
// Si quieres reutilizarlos en otras pantallas, muevelos a PALETTE en tema.js.
const CELEBRATION_COLORS = {
  gold: '#FFC93C',
  goldDark: '#E88A1F',
  coral: '#FF6F59',
  coralDark: '#D9432F',
  mint: '#3FD6C0',
  pink: '#FF6FA5',
  purple: '#9B6BFF',
  yellow: '#FFD93D',
  skyBlueSoft: '#8FDCFF',
  white: '#FFFFFF',
};

const CONFETTI_COLORS = [
  CELEBRATION_COLORS.coral,
  CELEBRATION_COLORS.mint,
  CELEBRATION_COLORS.pink,
  CELEBRATION_COLORS.purple,
  CELEBRATION_COLORS.yellow,
  CELEBRATION_COLORS.skyBlueSoft,
];

const EMOJI_CONFETTI = ['⭐', '🎉', '💫', '🎊'];
const BALLOON_COLORS = [CELEBRATION_COLORS.pink, CELEBRATION_COLORS.mint, CELEBRATION_COLORS.yellow, CELEBRATION_COLORS.purple];
const RAINBOW = [CELEBRATION_COLORS.coral, CELEBRATION_COLORS.yellow, CELEBRATION_COLORS.mint, CELEBRATION_COLORS.skyBlueSoft, CELEBRATION_COLORS.purple, CELEBRATION_COLORS.pink, CELEBRATION_COLORS.coral];

const CONFETTI_COUNT = 34;
const EMOJI_CONFETTI_COUNT = 8;
const STAR_FIELD_COUNT = 12;
const BURST_COUNT = 10;
const TITLE_TEXT = '¡Felicidades!';

// ---------------------------------------------------------------------
// Utilidades para el degradado del cielo (sin librerias externas)
// ---------------------------------------------------------------------

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function mixColors(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function buildGradientBands(stops, count) {
  const segments = stops.length - 1;
  const bands = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const segPos = t * segments;
    const segIndex = Math.min(Math.floor(segPos), segments - 1);
    const localT = segPos - segIndex;
    bands.push(mixColors(stops[segIndex], stops[segIndex + 1], localT));
  }
  return bands;
}

const SKY_STOPS = ['#2FA8F5', '#5EC6FF', '#8FDCFF', '#CFF3FF', '#FFF3C4'];
const SKY_BANDS = buildGradientBands(SKY_STOPS, 18);

// ---------------------------------------------------------------------
// Pantalla principal
// ---------------------------------------------------------------------

export default function GameFinishedScreen({ navigation }) {
  const trophyScale = useRef(new Animated.Value(0)).current;
  const trophyFloat = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(0)).current;
  const buttonPress = useRef(new Animated.Value(0)).current;
  const rainbowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(trophyScale, {
        toValue: 1,
        friction: 3.5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 500,
          delay: 550,
          useNativeDriver: true,
        }),
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 500,
          delay: 750,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyFloat, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(trophyFloat, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, { toValue: 1, duration: 900, delay: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(buttonPulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rainbowAnim, { toValue: 1, duration: 3200, easing: Easing.linear, useNativeDriver: false }),
    ).start();
  }, []);

  const trophyTranslateY = trophyFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const glowScale = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.2] });
  const glowOpacity = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.95] });
  const buttonScale = buttonPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const buttonPressOffset = buttonPress.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });
  const ringColor = rainbowAnim.interpolate({
    inputRange: RAINBOW.map((_, i) => i / (RAINBOW.length - 1)),
    outputRange: RAINBOW,
  });

  function handlePressIn() {
    Animated.timing(buttonPress, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  }

  function handlePressOut() {
    Animated.spring(buttonPress, { toValue: 0, friction: 4, useNativeDriver: true }).start();
  }

  return (
    <View style={styles.container}>
      <SkyGradient />
      <StarField />

      <View style={styles.balloonLayer} pointerEvents="none">
        {BALLOON_COLORS.map((color, i) => (
          <Balloon key={`balloon-${i}`} color={color} index={i} />
        ))}
      </View>

      <View style={styles.confettiLayer} pointerEvents="none">
        {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
          <ConfettiPiece key={`confetti-${i}`} />
        ))}
        {Array.from({ length: EMOJI_CONFETTI_COUNT }).map((_, i) => (
          <EmojiConfettiPiece key={`emoji-confetti-${i}`} />
        ))}
      </View>

      <View style={styles.trophyZone}>
        <Sunburst />

        <Animated.View style={[styles.glow, { transform: [{ scale: glowScale }], opacity: glowOpacity }]} />

        <Sparkle symbol="✨" style={{ top: 0, left: 6 }} delay={0} />
        <Sparkle symbol="⭐" style={{ top: 10, right: 2 }} delay={300} small />
        <Sparkle symbol="⭐" style={{ bottom: 34, left: -10 }} delay={600} />
        <Sparkle symbol="✨" style={{ bottom: 20, right: 6 }} delay={900} />
        <Sparkle symbol="✨" style={{ top: '46%', left: -14 }} delay={450} small />
        <Sparkle symbol="⭐" style={{ top: '42%', right: -12 }} delay={750} small />

        <ImpactBurst />

        <Animated.Text
          style={[
            styles.emoji,
            { transform: [{ scale: trophyScale }, { translateY: trophyTranslateY }] },
          ]}
        >
          🏆
        </Animated.Text>

        <Mascot />
      </View>

      <View style={styles.titleBadge}>
        <AnimatedTitle text={TITLE_TEXT} />
      </View>

      <Animated.View
        style={{
          opacity: subtitleFade,
          transform: [
            { translateY: subtitleFade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
          ],
        }}
      >
        <Text style={styles.subtitle}>✨ Completaste todos los niveles del juego ✨</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: buttonFade,
          transform: [
            { scale: buttonScale },
            { translateY: buttonFade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
          ],
        }}
      >
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => navigation.navigate(SCREENS.HOME)}>
          <Animated.View style={[styles.buttonRing, { backgroundColor: ringColor }]}>
            <View style={styles.buttonShadow}>
              <Animated.View style={[styles.buttonFace, { transform: [{ translateY: buttonPressOffset }] }]}>
                <Text style={styles.buttonIcon}></Text>
                <Text style={styles.buttonText}>Volver al inicio</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ---------------------------------------------------------------------
// Fondo: degradado del cielo
// ---------------------------------------------------------------------

function SkyGradient() {
  return (
    <View style={styles.skyGradient} pointerEvents="none">
      {SKY_BANDS.map((color, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: color }} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Estrellas titilando repartidas por toda la pantalla
// ---------------------------------------------------------------------

function StarField() {
  const stars = useRef(
    Array.from({ length: STAR_FIELD_COUNT }).map(() => ({
      top: Math.random() * SCREEN_HEIGHT * 0.85,
      left: Math.random() * (SCREEN_WIDTH - 20),
      size: 10 + Math.random() * 10,
      delay: Math.random() * 1600,
      symbol: Math.random() > 0.5 ? '✨' : '⭐',
    })),
  ).current;

  return (
    <View style={styles.starFieldLayer} pointerEvents="none">
      {stars.map((s, i) => (
        <Sparkle
          key={`star-${i}`}
          symbol={s.symbol}
          style={{ top: s.top, left: s.left, fontSize: s.size }}
          delay={s.delay}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------
// Rayos de sol girando detras de la copa
// ---------------------------------------------------------------------

function Sunburst() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 16000, easing: Easing.linear, useNativeDriver: true }),
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rayCount = 12;

  return (
    <Animated.View style={[styles.sunburstPivot, { transform: [{ rotate }] }]}>
      {Array.from({ length: rayCount }).map((_, i) => (
        <SunburstRay
          key={i}
          angle={(360 / rayCount) * i}
          color={i % 2 === 0 ? CELEBRATION_COLORS.gold : CELEBRATION_COLORS.yellow}
        />
      ))}
    </Animated.View>
  );
}

function SunburstRay({ angle, color }) {
  const length = 92;
  const width = 9;
  return (
    <View
      style={{
        position: 'absolute',
        width,
        height: length * 2,
        top: -length,
        left: -width / 2,
        transform: [{ rotate: `${angle}deg` }],
      }}
    >
      <View style={{ width, height: length, backgroundColor: color, opacity: 0.4, borderRadius: width / 2 }} />
    </View>
  );
}

// ---------------------------------------------------------------------
// Estallido de chispas cuando aparece la pantalla
// ---------------------------------------------------------------------

function ImpactBurst() {
  return (
    <View style={styles.burstContainer} pointerEvents="none">
      {Array.from({ length: BURST_COUNT }).map((_, i) => (
        <BurstParticle key={i} index={i} />
      ))}
    </View>
  );
}

function BurstParticle({ index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const angle = useRef((360 / BURST_COUNT) * index + Math.random() * 18).current;
  const distance = useRef(65 + Math.random() * 40).current;
  const symbol = useRef(EMOJI_CONFETTI[Math.floor(Math.random() * EMOJI_CONFETTI.length)]).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 850,
      delay: 220 + index * 30,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const rad = (angle * Math.PI) / 180;
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(rad) * distance] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(rad) * distance] });
  const opacity = anim.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.2, 1.2, 0.7] });

  return (
    <Animated.Text style={{ position: 'absolute', fontSize: 18, opacity, transform: [{ translateX }, { translateY }, { scale }] }}>
      {symbol}
    </Animated.Text>
  );
}

// ---------------------------------------------------------------------
// Titulo con letras que rebotan una por una
// ---------------------------------------------------------------------

function AnimatedTitle({ text }) {
  return (
    <View style={styles.titleRow}>
      {text.split('').map((char, i) => (
        <AnimatedLetter key={i} char={char} index={i} />
      ))}
    </View>
  );
}

function AnimatedLetter({ char, index }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      delay: 550 + index * 45,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });

  return (
    <Animated.Text style={[styles.titleLetter, { opacity: anim, transform: [{ scale: anim }, { translateY }] }]}>
      {char === ' ' ? '\u00A0' : char}
    </Animated.Text>
  );
}

// ---------------------------------------------------------------------
// Otros elementos animados: chispas, mascota, confeti, globos
// ---------------------------------------------------------------------

function Sparkle({ symbol, style, delay, small }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 700, delay, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.2] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '20deg'] });

  return (
    <Animated.Text style={[styles.sparkle, small && styles.sparkleSmall, style, { opacity, transform: [{ scale }, { rotate }] }]}>
      {symbol}
    </Animated.Text>
  );
}

function Mascot() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '10deg'] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  return (
    <Animated.Text style={[styles.mascot, { transform: [{ rotate }, { translateY }] }]}>
      🌟
    </Animated.Text>
  );
}

function ConfettiPiece() {
  const fall = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const left = useRef(Math.random() * SCREEN_WIDTH).current;
  const size = useRef(6 + Math.random() * 8).current;
  const color = useRef(CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]).current;
  const isCircle = useRef(Math.random() > 0.5).current;
  const fallDuration = useRef(3000 + Math.random() * 2400).current;
  const startDelay = useRef(Math.random() * 2500).current;
  const swayDuration = useRef(800 + Math.random() * 600).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fall, { toValue: 1, duration: fallDuration, delay: startDelay, easing: Easing.linear, useNativeDriver: true }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: swayDuration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: swayDuration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [-30, SCREEN_HEIGHT + 30] });
  const translateX = sway.interpolate({ inputRange: [0, 1], outputRange: [-16, 16] });
  const rotate = fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '520deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: isCircle ? size / 2 : 2,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  );
}

function EmojiConfettiPiece() {
  const fall = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const left = useRef(Math.random() * SCREEN_WIDTH).current;
  const symbol = useRef(EMOJI_CONFETTI[Math.floor(Math.random() * EMOJI_CONFETTI.length)]).current;
  const fontSize = useRef(14 + Math.random() * 8).current;
  const fallDuration = useRef(3800 + Math.random() * 2600).current;
  const startDelay = useRef(Math.random() * 3000).current;
  const swayDuration = useRef(1000 + Math.random() * 700).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fall, { toValue: 1, duration: fallDuration, delay: startDelay, easing: Easing.linear, useNativeDriver: true }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: swayDuration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: swayDuration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [-30, SCREEN_HEIGHT + 30] });
  const translateX = sway.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] });
  const rotate = fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.Text
      style={{ position: 'absolute', left, top: 0, fontSize, transform: [{ translateY }, { translateX }, { rotate }] }}
    >
      {symbol}
    </Animated.Text>
  );
}

function Balloon({ color, index }) {
  const rise = useRef(new Animated.Value(0)).current;
  const left = useRef(20 + Math.random() * (SCREEN_WIDTH - 60)).current;
  const duration = useRef(9000 + Math.random() * 4000).current;
  const startDelay = useRef(index * 1200 + Math.random() * 1000).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rise, { toValue: 1, duration, delay: startDelay, easing: Easing.linear, useNativeDriver: true }),
    ).start();
  }, []);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT * 0.15, -SCREEN_HEIGHT * 1.1] });
  const translateX = rise.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 16, -10] });
  const opacity = rise.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 0.85, 0.85, 0] });

  return (
    <Animated.View style={{ position: 'absolute', left, bottom: 0, opacity, transform: [{ translateY }, { translateX }] }}>
      <View style={[styles.balloonBody, { backgroundColor: color }]} />
      <View style={styles.balloonString} />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.skyBlue,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  skyGradient: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    zIndex: 0,
  },
  starFieldLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  balloonLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  balloonBody: {
    width: 34,
    height: 44,
    borderRadius: 20,
  },
  balloonString: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
  },
  trophyZone: {
    width: 220,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    zIndex: 4,
  },
  sunburstPivot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
  },
  glow: {
    position: 'absolute',
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: CELEBRATION_COLORS.gold,
  },
  burstContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 92,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 22,
  },
  sparkleSmall: {
    fontSize: 16,
  },
  mascot: {
    position: 'absolute',
    right: -2,
    bottom: 10,
    fontSize: 34,
  },
  titleBadge: {
    backgroundColor: CELEBRATION_COLORS.gold,
    borderWidth: 3,
    borderColor: CELEBRATION_COLORS.white,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginBottom: 14,
    zIndex: 4,
    shadowColor: CELEBRATION_COLORS.goldDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  titleRow: {
    flexDirection: 'row',
  },
  titleLetter: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: CELEBRATION_COLORS.goldDark,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: '500',
    color: PALETTE.textLight,
    textAlign: 'center',
    marginBottom: 28,
    zIndex: 4,
  },
  buttonRing: {
    borderRadius: 999,
    padding: 4,
    zIndex: 4,
  },
  buttonShadow: {
    backgroundColor: CELEBRATION_COLORS.coralDark,
    borderRadius: 999,
    paddingBottom: 6,
  },
  buttonFace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.woodBrown ?? CELEBRATION_COLORS.coral,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 999,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
  },
});