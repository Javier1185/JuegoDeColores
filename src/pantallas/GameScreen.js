/**
 * GameScreen.js
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import { getAnimalById } from '../constantes/animales';
import { getColorById } from '../constantes/colores';
import {
  generarNivel,
  TOTAL_NIVELES,
} from '../data/niveles';

import ScreenBackground from '../components/common/ScreenBackground';

const { width: SCREEN_WIDTH } =
  Dimensions.get('window');

const GRID_GAP = 16;

/**
 * Palabra del color con un contorno oscuro alrededor de las letras.
 * Así se lee bien sin importar el color (incluso blanco) y sin
 * necesidad de una caja de fondo que se vea rara con palabras largas.
 */
function PalabraColor({ texto, colorHex }) {
  const contorno = 'rgba(61, 43, 31, 0.45)';
  const desplazamientos = [
    [-1, -1], [1, -1],
    [-1, 1], [1, 1],
    [0, -1.2], [0, 1.2],
    [-1.2, 0], [1.2, 0],
  ];

  return (
    <View style={styles.colorWordWrapper}>
      {desplazamientos.map(([dx, dy], i) => (
        <Text
          key={i}
          style={[
            styles.colorWordText,
            {
              position: 'absolute',
              left: dx,
              top: dy,
              color: contorno,
            },
          ]}
        >
          {texto}
        </Text>
      ))}
      <Text
        style={[
          styles.colorWordText,
          { color: colorHex },
        ]}
      >
        {texto}
      </Text>
    </View>
  );
}
const MAX_CARD_SIZE = 150;

// Máximo de respuestas incorrectas permitidas
const MAX_INTENTOS_INCORRECTOS = 2;

const CARD_SIZE = Math.min(
  (SCREEN_WIDTH - 32 - GRID_GAP) / 2,
  MAX_CARD_SIZE
);

/*
|--------------------------------------------------------------------------
| Tarjeta del animal
|--------------------------------------------------------------------------
*/

function AnimalCard({
  animal,
  onPress,
  feedbackState,
}) {
  const scaleAnim = useRef(
    new Animated.Value(1)
  ).current;

  const shakeAnim = useRef(
    new Animated.Value(0)
  ).current;

  /*
   * Animación de respuesta correcta.
   */
  useEffect(() => {
    if (feedbackState === 'correct') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.18,
          useNativeDriver: true,
          speed: 20,
          bounciness: 12,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
      ]).start();
    }
  }, [feedbackState, scaleAnim]);

  /*
   * Animación de respuesta incorrecta.
   */
  useEffect(() => {
    if (feedbackState === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 60,
          useNativeDriver: true,
        }),

        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 60,
          useNativeDriver: true,
        }),

        Animated.timing(shakeAnim, {
          toValue: -7,
          duration: 60,
          useNativeDriver: true,
        }),

        Animated.timing(shakeAnim, {
          toValue: 7,
          duration: 60,
          useNativeDriver: true,
        }),

        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [feedbackState, shakeAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(animal)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
    >
      <Animated.View
        style={[
          styles.cardShadowWrapper,
          {
            transform: [
              {
                scale: scaleAnim,
              },
              {
                translateX: shakeAnim,
              },
            ],
          },
        ]}
      >
        <ImageBackground
          source={require(
            '../../assets/images/game/caja_fondo.png'
          )}
          style={styles.animalCard}
          imageStyle={styles.animalCardImage}
        >
          <Image
            source={animal.image}
            style={styles.animalImage}
            resizeMode="contain"
          />
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
}

/*
|--------------------------------------------------------------------------
| Botón animado
|--------------------------------------------------------------------------
*/

function AnimatedButton({
  onPress,
  children,
  style,
}) {
  const scaleAnim = useRef(
    new Animated.Value(1)
  ).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

/*
|--------------------------------------------------------------------------
| Pantalla principal del juego
|--------------------------------------------------------------------------
*/

export default function GameScreen({
  route,
  navigation,
}) {
  const level =
    route.params?.level ?? 1;

  const initialStars =
    route.params?.stars ?? 0;

  // Historial de colores usados
  const coloresUsados =
    route.params?.coloresUsados ?? [];

  /*
  |--------------------------------------------------------------------------
  | Generación del nivel
  |--------------------------------------------------------------------------
  */

  const nivelData = useRef(
    generarNivel(level, coloresUsados)
  ).current;

  const animalesDelNivel =
    nivelData.animalesIds
      .map((id) => getAnimalById(id))
      .filter(Boolean);

  const animalObjetivo = getAnimalById(
    nivelData.targetAnimalId
  );

  const colorObjetivo = getColorById(
    animalObjetivo?.colorId
  );

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  const [stars, setStars] =
    useState(initialStars);

  const [feedback, setFeedback] =
    useState(null);

  const [pressedId, setPressedId] =
    useState(null);

  const [
    intentosIncorrectos,
    setIntentosIncorrectos,
  ] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Audio del color
  |--------------------------------------------------------------------------
  */

  const soundRef = useRef(null);

  const playSound = useCallback(
    async (soundAsset) => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } =
          await Audio.Sound.createAsync(
            soundAsset
          );

        soundRef.current = sound;

        await sound.playAsync();
      } catch (error) {
        console.warn(
          'Error reproduciendo audio:',
          error
        );
      }
    },
    []
  );

  /*
   * Limpia el sonido cuando sale de GameScreen.
   */
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current
          .unloadAsync()
          .catch(() => {});

        soundRef.current = null;
      }
    };
  }, []);

  /*
   * Reproduce únicamente el audio del color
   * cuando se presiona el botón de bocina.
   */
  const handleReplayAudio = () => {
    if (colorObjetivo?.audio) {
      playSound(colorObjetivo.audio);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Validar animal seleccionado
  |--------------------------------------------------------------------------
  */

  const handleAnimalPress = (animal) => {
    /*
     * Evita seleccionar otro animal mientras
     * se muestra la animación.
     */
    if (feedback) {
      return;
    }

    setPressedId(animal.id);

    /*
    |--------------------------------------------------------------------------
    | Respuesta correcta
    |--------------------------------------------------------------------------
    */

    if (
      animal.id === animalObjetivo?.id
    ) {
      const newStars = stars + 1;

      setStars(newStars);
      setIntentosIncorrectos(0);
      setFeedback('correct');

      /*
       * IMPORTANTE:
       *
       * Aquí ya no se reproduce ningún audio
       * de respuesta correcta.
       *
       * El audio aleatorio se reproduce en
       * LevelCompleteScreen.
       */

      const nuevosColoresUsados = [
        ...coloresUsados,
        nivelData.colorId,
      ].filter(Boolean);

      setTimeout(() => {
        navigation.navigate(
          SCREENS.LEVEL_COMPLETE,
          {
            level,
            stars: newStars,

            isLastLevel:
              level >= TOTAL_NIVELES,

            coloresUsados:
              nuevosColoresUsados,

            resultado: 'correcto',

            colorCorrecto:
              colorObjetivo?.label ??
              nivelData.colorId,
          }
        );
      }, 1000);

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Respuesta incorrecta
    |--------------------------------------------------------------------------
    */

    const nuevosIntentos =
      intentosIncorrectos + 1;

    setIntentosIncorrectos(
      nuevosIntentos
    );

    setFeedback('wrong');

    /*
     * Si se equivocó dos veces, abre
     * LevelCompleteScreen con el niño triste.
     */
    if (
      nuevosIntentos >=
      MAX_INTENTOS_INCORRECTOS
    ) {
      setTimeout(() => {
        setFeedback(null);
        setPressedId(null);
        setIntentosIncorrectos(0);

        navigation.navigate(
          SCREENS.LEVEL_COMPLETE,
          {
            level,
            stars,

            isLastLevel:
              level >= TOTAL_NIVELES,

            coloresUsados,

            resultado: 'incorrecto',

            colorCorrecto:
              colorObjetivo?.label ??
              nivelData.colorId,
          }
        );
      }, 1000);

      return;
    }

    /*
     * En el primer error permite
     * volver a intentarlo.
     */
    setTimeout(() => {
      setFeedback(null);
      setPressedId(null);
    }, 1000);
  };

  /*
  |--------------------------------------------------------------------------
  | Validación del nivel
  |--------------------------------------------------------------------------
  */

  if (!colorObjetivo || !animalObjetivo) {
    return (
      <View style={styles.errorContainer}>
        <Text>
          Error cargando nivel. Vuelve al inicio.
        </Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Interfaz
  |--------------------------------------------------------------------------
  */

  return (
    <ScreenBackground
      source={require(
        '../../assets/images/backgrounds/home-background.jpeg'
      )}
    >
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <AnimatedButton
            onPress={() =>
              navigation.navigate(
                SCREENS.HOME
              )
            }
            style={styles.iconButton}
          >
            <Ionicons
              name="home"
              size={24}
              color={PALETTE.woodBrownDark}
            />
          </AnimatedButton>

          <Text style={styles.levelText}>
            Nivel {level}
          </Text>

          <View style={styles.starsContainer}>
            <Text style={styles.starsText}>
              ⭐ {stars}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Instrucción del color */}
          <View style={styles.promptBanner}>
            <AnimatedButton
              onPress={handleReplayAudio}
              style={styles.speakerButton}
            >
              <Ionicons
                name="volume-high"
                size={22}
                color="#FFFFFF"
              />
            </AnimatedButton>

            <View style={styles.promptTextRow}>
              <Text style={styles.promptText}>
                Toca el animal
              </Text>

              <PalabraColor
                texto={colorObjetivo.label}
                colorHex={colorObjetivo.hex}
              />
            </View>
          </View>

          {/* Animales */}
          <View
            style={
              styles.animalsGridWrapper
            }
          >
            <View style={styles.animalsGrid}>
              {animalesDelNivel.map(
                (animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onPress={
                      handleAnimalPress
                    }
                    feedbackState={
                      pressedId === animal.id
                        ? feedback
                        : null
                    }
                  />
                )
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenBackground>
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
    paddingTop: 50,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  iconButton: {
    backgroundColor:
      'rgba(255,255,255,0.85)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  levelText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.textDark,
    backgroundColor:
      'rgba(255,255,255,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  starsContainer: {
    backgroundColor:
      'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  starsText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.woodBrownDark,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  animalsGridWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },

  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  speakerButton: {
    backgroundColor: PALETTE.skyBlue,
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  promptTextRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 8,
    rowGap: 6,
  },

  promptText: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: PALETTE.textDark,
  },

  colorWordWrapper: {
    position: 'relative',
  },

  colorWordText: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '800',
  },

  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: GRID_GAP,
  },

  cardShadowWrapper: {
    borderRadius: 20,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  animalCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  animalCardImage: {
    resizeMode: 'contain',
  },

  animalImage: {
    width: '70%',
    height: '70%',
  },

  feedbackBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },

  feedbackText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
  },
});