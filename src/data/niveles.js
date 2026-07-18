/**
 * niveles.js
 * -----------------------------------------------------------------------
 * Define los niveles del juego y el sistema de dificultad.
 *
 * Cada nivel tiene un pool de animales dividido en 3 categorías:
 *   - facil:  animales con colores muy distintos y conocidos (azul, rojo)
 *   - medio:  colores un poco más parecidos entre sí (verde, amarillo)
 *   - dificil: colores menos comunes o más parecidos (rosado, gris, marrón)
 *
 * En cada nivel se muestran EXACTAMENTE 4 animales:
 *   - 2 fáciles + 1 medio + 1 difícil
 *
 * La selección dentro de cada categoría es ALEATORIA (Math.random),
 * por lo que el juego se siente distinto en cada partida.
 *
 * Para agregar un animal nuevo: solo agrégalo en ANIMALS_BY_DIFFICULTY
 * usando su "id" tal como está definido en constantes/animales.js.
 * -----------------------------------------------------------------------
 */

// -----------------------------------------------------------------
// CATÁLOGO DE DIFICULTAD
// Usa los mismos "id" que en constantes/animales.js
// -----------------------------------------------------------------
export const ANIMALS_BY_DIFFICULTY = {
  facil: [
    'vaca',     // azul  — color muy reconocible
    'gallina',  // rojo  — color muy reconocible
  ],
  medio: [
    'pato',     // amarillo — un poco más sutil
    'rana',     // verde    — un poco más sutil
  ],
  dificil: [
    'cerdo',    // rosado   — color menos común
    'perro',    // gris     — color menos común
    'ardilla',  // marrón   — color más abstracto
    'jirafa',   // amarillo — confusión posible con pato
  ],
};

// -----------------------------------------------------------------
// CONFIGURACIÓN DE NIVELES
// Cada nivel puede personalizar cuántos animales de cada categoría
// se muestran. La suma siempre debe dar 4.
// -----------------------------------------------------------------
const NIVELES_CONFIG = [
  {
    nivel: 1,
    titulo: 'Nivel 1 — Fácil',
    cantidadFacil: 2,
    cantidadMedio: 1,
    cantidadDificil: 1,
  },
  {
    nivel: 2,
    titulo: 'Nivel 2 — Medio',
    cantidadFacil: 1,
    cantidadMedio: 2,
    cantidadDificil: 1,
  },
  {
    nivel: 3,
    titulo: 'Nivel 3 — Difícil',
    cantidadFacil: 1,
    cantidadMedio: 1,
    cantidadDificil: 2,
  },
];

export const TOTAL_NIVELES = NIVELES_CONFIG.length;

// -----------------------------------------------------------------
// UTILIDADES
// -----------------------------------------------------------------

/**
 * Baraja un array y devuelve una COPIA mezclada (no modifica el original).
 * Usa el algoritmo Fisher-Yates.
 */
function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Selecciona `cantidad` elementos al azar de `array` sin repetir.
 * Si se piden más elementos de los que hay, devuelve todos los disponibles.
 */
function pickRandom(array, cantidad) {
  return shuffleArray(array).slice(0, cantidad);
}

// -----------------------------------------------------------------
// FUNCIÓN PRINCIPAL
// -----------------------------------------------------------------

/**
 * Genera los 4 IDs de animales que se mostrarán en un nivel dado,
 * respetando la distribución de dificultad configurada.
 *
 * @param {number} numeroNivel - número de nivel (1, 2, 3...)
 * @returns {{ animalesIds: string[], targetAnimalId: string }}
 *   - animalesIds: array de 4 ids de animales mezclados aleatoriamente
 *   - targetAnimalId: el id del animal que el jugador debe tocar
 *                     (uno de los animalesIds, elegido al azar)
 */
export function generarNivel(numeroNivel) {
  // Si el nivel no existe, usamos el último disponible
  const config =
    NIVELES_CONFIG.find((n) => n.nivel === numeroNivel) ||
    NIVELES_CONFIG[NIVELES_CONFIG.length - 1];

  // Seleccionamos aleatoriamente los ids de cada categoría
  const seleccionFacil = pickRandom(
    ANIMALS_BY_DIFFICULTY.facil,
    config.cantidadFacil
  );
  const seleccionMedio = pickRandom(
    ANIMALS_BY_DIFFICULTY.medio,
    config.cantidadMedio
  );
  const seleccionDificil = pickRandom(
    ANIMALS_BY_DIFFICULTY.dificil,
    config.cantidadDificil
  );

  // Unimos los 4 animales y los volvemos a mezclar para que el animal
  // correcto no siempre esté en la misma posición de la grilla.
  const animalesIds = shuffleArray([
    ...seleccionFacil,
    ...seleccionMedio,
    ...seleccionDificil,
  ]);

  // El animal objetivo (el que debe tocar el niño) se elige al azar
  // entre los 4 seleccionados.
  const targetAnimalId =
    animalesIds[Math.floor(Math.random() * animalesIds.length)];

  return { animalesIds, targetAnimalId };
}