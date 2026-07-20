/**
 * sonidoBoton.js
 * -----------------------------------------------------------------------
 * Utilidad centralizada para reproducir el efecto de sonido de "botón
 * presionado" (EFFECTS.button) desde cualquier componente de botón.
 *
 * Por qué existe:
 *  - Evita cargar el archivo de audio en cada tap (lo carga UNA vez y
 *    reutiliza la misma instancia de Sound para toda la sesión).
 *  - Se llama de forma "fire and forget" (no se espera con await en el
 *    onPress del botón), para que el sonido nunca retrase la navegación
 *    o la acción real del botón.
 * -----------------------------------------------------------------------
 */

import { Audio } from 'expo-av';
import { EFFECTS } from '../constantes/configuracionAudio';

let soundInstance = null;
let cargaEnCurso = null;

async function obtenerSonido() {
  if (soundInstance) return soundInstance;

  if (!cargaEnCurso) {
    cargaEnCurso = Audio.Sound.createAsync(EFFECTS.button, {
      volume: 0.6,
    }).then(({ sound }) => {
      soundInstance = sound;
      return sound;
    });
  }

  return cargaEnCurso;
}

export async function reproducirSonidoBoton() {
  try {
    const sound = await obtenerSonido();
    // Rebobinar al inicio por si el usuario presiona varios botones
    // rápido y el sonido anterior todavía no terminó.
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (error) {
    console.warn('No se pudo reproducir el sonido del botón:', error);
  }
}

export default reproducirSonidoBoton;