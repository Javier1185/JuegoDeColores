/**
 * HomeScreen.js
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import ScreenBackground from '../components/common/ScreenBackground';
import { reproducirSonidoBoton } from '../utils/sonidoBoton';
import { obtenerEstrellasTotales } from '../utils/almacenamiento';

function WoodButton({ label, onPress, colors }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const esBotonJugar = label === 'Jugar';

  // Latido suave y continuo, solo para el botón "Jugar",
  // para invitar al niño a presionarlo.
  useEffect(() => {
    if (!esBotonJugar) return;

    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ])
    );

    latido.start();

    return () => latido.stop();
  }, [esBotonJugar]);

  const getIcon = () => {
    switch (label) {
      case 'Jugar':
        return '▶';
      case 'Cómo jugar':
        return '';
      case 'Créditos':
        return '';
      case 'Configuración':
        return '⚙';
      default:
        return '';
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.06,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    reproducirSonidoBoton();
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={styles.buttonTouchable}
    >
      <Animated.View
        style={[
          styles.buttonOuter,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        {/* Sombra */}

        <View style={styles.buttonShadow} />

        {/* Botón */}

        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          {/* brillo */}

          <View style={styles.buttonLight} />

          {/* hojas */}

          <Text style={styles.leafLeft}></Text>
          <Text style={styles.leafRight}></Text>

          <Text style={styles.buttonText}>
            {getIcon()}   {label}
          </Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [totalEstrellas, setTotalEstrellas] = useState(0);

  /*
   * Recarga el total de estrellas guardadas cada vez que
   * el jugador vuelve a esta pantalla (por ejemplo, después
   * de terminar un nivel), no solo al montar el componente.
   */
  useFocusEffect(
    useCallback(() => {
      let activo = true;

      obtenerEstrellasTotales().then((total) => {
        if (activo) setTotalEstrellas(total);
      });

      return () => {
        activo = false;
      };
    }, [])
  );

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

        <View style={styles.starsTotalContainer}>
          <Text style={styles.starsTotalText}>
            ⭐ {totalEstrellas}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <WoodButton
             label="Jugar"
    colors={['#72F15A','#41C93B','#239F2D']}
            onPress={() => navigation.navigate(SCREENS.GAME, { level: 1, stars: 0 })}
          />
          <WoodButton
             label="Cómo jugar"
    colors={['#D89A58','#B56C2C','#8E4F1B']}
            onPress={() => navigation.navigate(SCREENS.HOW_TO_PLAY)}
          />
          <WoodButton
               label="Créditos"
    colors={['#D89A58','#B56C2C','#8E4F1B']}
            onPress={() => navigation.navigate(SCREENS.CREDITS)}
          />
          <WoodButton
             label="Configuración"
    colors={['#B97942','#8F5324','#6E3E17']}
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
  starsTotalContainer: {
    position: 'absolute',
    top: '5%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 290,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  starsTotalText: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: PALETTE.woodBrownDark,
  },
  buttonTouchable: {
  width: '100%',
},

buttonOuter: {
  borderRadius: 30,
},

buttonShadow: {
  position: 'absolute',
  top: 7,
  left: 0,
  right: 0,
  bottom: -2,
  borderRadius: 30,
  backgroundColor: '#4b2d12',
},

button: {
  borderRadius: 30,
  paddingVertical: 18,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#F8E6B2',
  overflow: 'hidden',
},

buttonLight: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '45%',
  backgroundColor: 'rgba(255,255,255,0.18)',
},

buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 26,
  textShadowColor: '#5B2F00',
  textShadowOffset: {
    width: 2,
    height: 2,
  },
  textShadowRadius: 3,
},

leafLeft: {
  position: 'absolute',
  left: 18,
  top: 10,
  fontSize: 22,
},

leafRight: {
  position: 'absolute',
  right: 18,
  bottom: 8,
  fontSize: 22,
},

});