import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREENS } from '../navegacion/AppNavigator';

import {
  MENSAJES_CORRECTOS,
  MENSAJES_INCORRECTOS,
  obtenerMensajeAleatorio,
} from '../constantes/mensajes';

import { reproducirSonidoBoton } from '../utils/sonidoBoton';

// Imágenes del niño
import NinoImage from '../../assets/images/niño/niño.png';
import NinoTristeImage from '../../assets/images/niño/niño_triste.png';

/*
|--------------------------------------------------------------------------
| Colores disponibles
|--------------------------------------------------------------------------
*/

const COLOR_HEX = {
  ROJO: '#E53935',
  AZUL: '#1687D9',
  AMARILLO: '#F6C900',
  VERDE: '#43A047',
  NARANJA: '#FB8C00',
  MORADO: '#8E44AD',
  VIOLETA: '#8E44AD',
  ROSADO: '#EC407A',
};

/*
|--------------------------------------------------------------------------
| Confeti
|--------------------------------------------------------------------------
*/

const CONFETTI = [
  {
    top: '7%',
    left: '8%',
    color: '#FF4081',
    rotate: '40deg',
  },
  {
    top: '13%',
    left: '20%',
    color: '#FFD600',
    rotate: '-20deg',
  },
  {
    top: '5%',
    left: '29%',
    color: '#FF4FA3',
    rotate: '-30deg',
  },
  {
    top: '8%',
    right: '29%',
    color: '#42A5F5',
    rotate: '20deg',
  },
  {
    top: '13%',
    right: '18%',
    color: '#FFCA28',
    rotate: '45deg',
  },
  {
    top: '20%',
    right: '6%',
    color: '#AB47BC',
    rotate: '-20deg',
  },
  {
    top: '31%',
    left: '5%',
    color: '#29B6F6',
    rotate: '40deg',
  },
  {
    top: '40%',
    right: '4%',
    color: '#FFEB3B',
    rotate: '-30deg',
  },
  {
    top: '52%',
    left: '6%',
    color: '#FF5252',
    rotate: '30deg',
  },
  {
    top: '59%',
    right: '8%',
    color: '#26C6DA',
    rotate: '-25deg',
  },
  {
    top: '74%',
    left: '5%',
    color: '#66BB6A',
    rotate: '40deg',
  },
  {
    top: '79%',
    right: '5%',
    color: '#FFCA28',
    rotate: '25deg',
  },
  {
    bottom: '8%',
    left: '14%',
    color: '#FF4081',
    rotate: '-35deg',
  },
  {
    bottom: '5%',
    right: '16%',
    color: '#29B6F6',
    rotate: '30deg',
  },
];

/*
|--------------------------------------------------------------------------
| Pantalla de resultado
|--------------------------------------------------------------------------
*/

export default function LevelCompleteScreen({
  route,
  navigation,
}) {
  const { height } = useWindowDimensions();

  /*
   * Obtiene el espacio seguro del dispositivo.
   * Evita que la barra superior quede detrás
   * del notch o la isla dinámica.
   */
  const insets = useSafeAreaInsets();

  /*
  |--------------------------------------------------------------------------
  | Parámetros recibidos desde GameScreen
  |--------------------------------------------------------------------------
  */

  const {
    level = 1,
    stars = 0,
    isLastLevel = false,
    coloresUsados = [],
    resultado = 'correcto',
    colorCorrecto = '',
  } = route.params ?? {};

  const esCorrecto =
    resultado === 'correcto';

  /*
  |--------------------------------------------------------------------------
  | Seleccionar mensaje aleatorio
  |--------------------------------------------------------------------------
  */

  const mensajeSeleccionado = useRef(
    obtenerMensajeAleatorio(
      esCorrecto
        ? MENSAJES_CORRECTOS
        : MENSAJES_INCORRECTOS
    )
  ).current;

  /*
   * Mensaje de respaldo para evitar
   * que la pantalla quede en blanco.
   */
  const mensaje =
    mensajeSeleccionado ?? {
      texto: esCorrecto
        ? '¡Muy bien!'
        : '¡Vamos otra vez!',
      audio: null,
    };

  /*
  |--------------------------------------------------------------------------
  | Animaciones
  |--------------------------------------------------------------------------
  */

  const scaleAnim = useRef(
    new Animated.Value(0.6)
  ).current;

  const opacityAnim = useRef(
    new Animated.Value(0)
  ).current;

  const floatingAnim = useRef(
    new Animated.Value(0)
  ).current;

  /*
   * Referencia del audio.
   */
  const soundRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Color encontrado
  |--------------------------------------------------------------------------
  */

  const ultimoColor = String(
    colorCorrecto ||
      (coloresUsados.length > 0
        ? coloresUsados[
            coloresUsados.length - 1
          ]
        : 'AZUL')
  ).toUpperCase();

  const colorEncontrado =
    COLOR_HEX[ultimoColor] || '#1687D9';

  /*
  |--------------------------------------------------------------------------
  | Ejecutar animaciones
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 9,
        bounciness: 13,
        useNativeDriver: true,
      }),

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const floatingAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: -7,
            duration: 850,
            useNativeDriver: true,
          }),

          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 850,
            useNativeDriver: true,
          }),
        ])
      );

    floatingAnimation.start();

    return () => {
      floatingAnimation.stop();
    };
  }, [
    floatingAnim,
    opacityAnim,
    scaleAnim,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Reproducir el audio del mensaje
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let pantallaActiva = true;

    const reproducirMensaje = async () => {
      try {
        /*
         * Si no tiene audio, continúa mostrando
         * la pantalla normalmente.
         */
        if (!mensaje.audio) {
          return;
        }

        /*
         * Limpia cualquier audio anterior.
         */
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        /*
         * Carga el audio asociado con la frase.
         */
        const { sound } =
          await Audio.Sound.createAsync(
            mensaje.audio
          );

        if (!pantallaActiva) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;

        /*
         * Reproduce el mensaje automáticamente.
         */
        await sound.playAsync();
      } catch (error) {
        /*
         * Un error de audio no debe dejar
         * la pantalla en blanco.
         */
        console.warn(
          'Error reproduciendo el mensaje:',
          error
        );
      }
    };

    reproducirMensaje();

    return () => {
      pantallaActiva = false;

      if (soundRef.current) {
        soundRef.current
          .unloadAsync()
          .catch(() => {});

        soundRef.current = null;
      }
    };
  }, [mensaje.audio]);

  /*
  |--------------------------------------------------------------------------
  | Continuar o reintentar
  |--------------------------------------------------------------------------
  */

  const handleContinue = () => {
    reproducirSonidoBoton();

    /*
     * Si falló dos veces, repite el nivel.
     */
    if (!esCorrecto) {
      navigation.replace(SCREENS.GAME, {
        level,
        stars,
        coloresUsados,
      });

      return;
    }

    /*
     * Si completó el último nivel,
     * muestra el resultado final.
     */
    if (isLastLevel) {
      navigation.navigate(
        SCREENS.GAME_FINISHED,
        {
          stars,
          coloresUsados,
        }
      );

      return;
    }

    /*
     * Avanza al siguiente nivel.
     */
    navigation.navigate(SCREENS.GAME, {
      level: level + 1,
      stars,
      coloresUsados,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Regresar al inicio
  |--------------------------------------------------------------------------
  */

  const handleHome = () => {
    reproducirSonidoBoton();

    if (SCREENS.HOME) {
      navigation.navigate(SCREENS.HOME);
    } else {
      navigation.goBack();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Interfaz
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.container}>
      {/* Fondo del paisaje */}
      <LinearGradient
        colors={[
          '#2196B0',
          '#73C269',
          '#3E7E26',
        ]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Sol */}
      <View style={styles.sun} />

      {/* Nubes */}
      <View
        style={[
          styles.cloud,
          styles.cloudLeft,
        ]}
      />

      <View
        style={[
          styles.cloud,
          styles.cloudRight,
        ]}
      />

      {/* Colinas */}
      <View
        style={[
          styles.hill,
          styles.hillLeft,
        ]}
      />

      <View
        style={[
          styles.hill,
          styles.hillRight,
        ]}
      />

      {/* Capa oscura */}
      <View style={styles.backgroundOverlay} />

      {/* Confeti: aparece solamente al acertar */}
      {esCorrecto &&
        CONFETTI.map((item, index) => (
          <View
            key={index}
            style={[
              styles.confetti,
              item,
              {
                backgroundColor:
                  item.color,

                transform: [
                  {
                    rotate: item.rotate,
                  },
                ],
              },
            ]}
          />
        ))}

      {/*
      |--------------------------------------------------------------------------
      | Barra superior
      |--------------------------------------------------------------------------
      |
      | La posición utiliza insets.top para evitar
      | la isla dinámica y la barra de estado.
      */}

      <View
        style={[
          styles.topBar,
          {
            top: insets.top + 8,
          },
        ]}
      >
        {/* Botón de inicio */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleHome}
          activeOpacity={0.8}
        >
          <Text style={styles.homeIcon}>
            ⌂
          </Text>
        </TouchableOpacity>

        {/* Nivel completado o reintentar */}
        <LinearGradient
          colors={
            esCorrecto
              ? ['#79C43B', '#3D941D']
              : ['#FF9F43', '#E85D35']
          }
          style={styles.levelHeader}
        >
          <Text
            style={styles.levelHeaderText}
          >
            {esCorrecto
              ? `NIVEL ${level} COMPLETADO`
              : 'INTÉNTALO DE NUEVO'}
          </Text>
        </LinearGradient>

        {/* Estrellas acumuladas */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreStar}>
            ⭐
          </Text>

          <Text style={styles.scoreText}>
            {stars}
          </Text>
        </View>
      </View>

      {/* Contenido principal */}
      <Animated.View
        style={[
          styles.celebrationWrapper,
          {
            opacity: opacityAnim,

            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        {/* Tarjeta principal */}
        <View style={styles.woodBorder}>
          <LinearGradient
            colors={[
              '#D18A38',
              '#8B4B19',
              '#C97627',
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={styles.woodGradient}
          >
            <LinearGradient
              colors={[
                '#FFFDF1',
                '#FFF3CE',
              ]}
              style={styles.paperCard}
            >
              {/* Mensaje aleatorio */}
              <Text
                style={[
                  styles.title,

                  mensaje.texto.length > 15 &&
                    styles.longTitle,

                  !esCorrecto &&
                    styles.incorrectTitle,
                ]}
              >
                {mensaje.texto}
              </Text>

              {/* Subtítulo */}
              <Text style={styles.subtitle}>
                {esCorrecto
                  ? '¡Muy bien hecho!'
                  : 'No fue esta vez'}
              </Text>

              {/* Resultado */}
              {esCorrecto ? (
                <Text
                  style={
                    styles.colorSentence
                  }
                >
                  Encontraste el color{' '}

                  <Text
                    style={[
                      styles.colorName,
                      {
                        color:
                          colorEncontrado,
                      },
                    ]}
                  >
                    {ultimoColor}
                  </Text>
                  .
                </Text>
              ) : (
                <Text
                  style={
                    styles.colorSentence
                  }
                >
                  Te equivocaste dos veces.
                  {'\n'}
                  ¡Puedes intentarlo nuevamente!
                </Text>
              )}

              {/* Imagen feliz o triste */}
              <View
                style={[
                  styles.characterContainer,
                  {
                    height:
                      height < 700
                        ? 220
                        : 285,
                  },
                ]}
              >
                <Image
                  source={
                    esCorrecto
                      ? NinoImage
                      : NinoTristeImage
                  }
                  style={
                    styles.characterImage
                  }
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Estrellas superiores */}
        {esCorrecto && (
          <Animated.View
            style={[
              styles.starsRow,
              {
                transform: [
                  {
                    translateY:
                      floatingAnim,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.sideStar}>
              ⭐
            </Text>

            <Text style={styles.mainStar}>
              ⭐
            </Text>

            <Text style={styles.sideStar}>
              ⭐
            </Text>
          </Animated.View>
        )}

        {/* Botón inferior */}
        <TouchableOpacity
          style={[
            styles.continueButtonContainer,

            !esCorrecto &&
              styles.retryButtonContainer,
          ]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              esCorrecto
                ? ['#8BD331', '#3E9D16']
                : ['#FF9F43', '#E85D35']
            }
            style={[
              styles.continueButton,

              !esCorrecto &&
                styles.retryButton,
            ]}
          >
            {esCorrecto ? (
              <Text
                style={styles.continueStar}
              >
                ⭐
              </Text>
            ) : (
              <Text style={styles.retryText}>
                ↻ Reintentar
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| Estilos
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 75,
    paddingBottom: 45,
  },

  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(13, 57, 44, 0.28)',
  },

  sun: {
    position: 'absolute',
    top: 75,
    right: 35,
    width: 100,
    height: 100,
    borderRadius: 50,

    backgroundColor:
      'rgba(255, 220, 70, 0.6)',
  },

  cloud: {
    position: 'absolute',
    width: 160,
    height: 55,
    borderRadius: 50,

    backgroundColor:
      'rgba(255,255,255,0.22)',
  },

  cloudLeft: {
    top: 105,
    left: -25,
  },

  cloudRight: {
    top: 165,
    right: -35,
  },

  hill: {
    position: 'absolute',
    bottom: -130,
    width: 420,
    height: 330,
    borderRadius: 220,

    backgroundColor: '#397D25',
  },

  hillLeft: {
    left: -180,
  },

  hillRight: {
    right: -170,

    backgroundColor: '#2D6F20',
  },

  confetti: {
    position: 'absolute',
    width: 15,
    height: 27,
    borderRadius: 4,
    zIndex: 3,
  },

  /*
   * El valor top se establece directamente
   * en el componente usando insets.top.
   */
  topBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  homeButton: {
    position: 'absolute',
    left: 0,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#BF8B25',

    borderWidth: 4,
    borderColor: '#8B6017',
  },

  homeIcon: {
    color: '#FFF1B0',
    fontSize: 35,
    fontWeight: '900',
    lineHeight: 38,
  },

  levelHeader: {
    minWidth: 230,
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 22,

    borderWidth: 3,
    borderColor: '#397F18',
  },

  levelHeaderText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },

  scoreContainer: {
    position: 'absolute',
    right: 0,
    minWidth: 68,
    height: 51,
    paddingHorizontal: 8,
    borderRadius: 14,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#56321B',

    borderWidth: 3,
    borderColor: '#8C5C28',
  },

  scoreStar: {
    fontSize: 23,
    marginRight: 2,
  },

  scoreText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  celebrationWrapper: {
    width: '100%',
    maxWidth: 530,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  woodBorder: {
    width: '100%',
    borderRadius: 38,
    padding: 0,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 14,
  },

  woodGradient: {
    padding: 9,
    borderRadius: 38,

    borderWidth: 3,
    borderColor: '#743B13',
  },

  paperCard: {
    minHeight: 485,
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 43,
    paddingHorizontal: 20,
    borderRadius: 29,

    borderWidth: 3,
    borderColor: '#FFE6A6',
  },

  starsRow: {
    position: 'absolute',
    top: -58,
    zIndex: 10,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#5D2C00',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 20,
  },

  sideStar: {
    fontSize: 70,
    marginHorizontal: -9,
  },

  mainStar: {
    fontSize: 95,
    marginHorizontal: -9,
    zIndex: 2,
  },

  title: {
    color: '#319522',
    fontSize: 48,
    lineHeight: 58,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4,

    textShadowColor:
      'rgba(255,255,255,0.8)',

    textShadowOffset: {
      width: 0,
      height: 2,
    },

    textShadowRadius: 2,
  },

  longTitle: {
    fontSize: 39,
    lineHeight: 46,
  },

  incorrectTitle: {
    color: '#E85D35',
  },

  subtitle: {
    color: '#1E1E1E',
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 1,
  },

  colorSentence: {
    color: '#111111',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },

  colorName: {
    fontWeight: '900',
  },

  characterContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginTop: 6,
  },

  characterImage: {
    width: '94%',
    height: '100%',
  },

  continueButtonContainer: {
    position: 'absolute',
    bottom: -46,
    width: 105,
    height: 105,
    borderRadius: 53,
    zIndex: 12,

    shadowColor: '#143E0E',

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 18,
  },

  continueButton: {
    width: '100%',
    height: '100%',
    borderRadius: 53,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 5,
    borderColor: '#337F16',
  },

  continueStar: {
    fontSize: 58,
  },

  retryButtonContainer: {
    bottom: -35,
    width: 190,
    height: 70,
    borderRadius: 35,
  },

  retryButton: {
    borderRadius: 35,
    borderColor: '#B73C21',
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
});