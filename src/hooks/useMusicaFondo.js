/**
 * useMusicaFondo.js
 * -----------------------------------------------------------------------
 * Hook para música de fondo con manejo robusto del ciclo de vida.
 *
 * Problemas que resuelve:
 *  - En desarrollo, Expo Fast Refresh desmonta/remonta componentes y
 *    el Sound object anterior puede quedar corrupto en memoria.
 *  - Se agrega un reintento automático si la primera carga falla.
 *  - Se usa Audio.setAudioModeAsync ANTES de crear el Sound.
 * -----------------------------------------------------------------------
 */

import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { MUSIC } from '../constantes/configuracionAudio';

export default function useMusicaFondo(volumen = 0.35) {
  const soundRef = useRef(null);
  const intentosRef = useRef(0);
  const MAX_INTENTOS = 3;

  useEffect(() => {
    let mounted = true;
    let removerListeners = () => {};

    // En web, los navegadores bloquean el autoplay de audio si el usuario
    // no ha interactuado todavía con la página (ej. al recargar con F5 /
    // el botón de recargar del navegador, no hay interacción previa).
    // Si Audio.Sound falla al reproducir por esto, dejamos "armado" el
    // audio para que arranque en el primer click/tap/tecla del usuario.
    const armarReproduccionEnInteraccion = (sound) => {
      if (Platform.OS !== 'web') return;

      const intentarReproducir = () => {
        sound.playAsync().catch(() => {});
      };

      window.addEventListener('pointerdown', intentarReproducir, { once: true });
      window.addEventListener('keydown', intentarReproducir, { once: true });
      window.addEventListener('touchstart', intentarReproducir, { once: true });

      removerListeners = () => {
        window.removeEventListener('pointerdown', intentarReproducir);
        window.removeEventListener('keydown', intentarReproducir);
        window.removeEventListener('touchstart', intentarReproducir);
      };
    };

    const configurarYReproducir = async () => {
      // Limpiamos cualquier instancia previa que haya quedado
      // (esto es clave cuando Expo Fast Refresh recarga el componente)
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (_) {}
        soundRef.current = null;
      }

      try {
        // Configurar modo de audio primero, siempre
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Creamos el Sound SIN reproducir automáticamente, para poder
        // capturar el error de autoplay por separado y no confundirlo
        // con un error real de carga del archivo.
        const { sound } = await Audio.Sound.createAsync(
          MUSIC.background,
          {
            isLooping: true,
            volume: volumen,
            shouldPlay: false,
          }
        );

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        intentosRef.current = 0; // reset intentos al éxito

        try {
          await sound.playAsync();
        } catch (playError) {
          // Bloqueado por la política de autoplay del navegador.
          // Queda armado para reproducir en la primera interacción.
          console.warn('Autoplay bloqueado, esperando interacción del usuario:', playError);
          armarReproduccionEnInteraccion(sound);
        }
      } catch (error) {
        console.warn(`Error música de fondo (intento ${intentosRef.current + 1}):`, error);

        // Reintento automático con delay creciente
        if (mounted && intentosRef.current < MAX_INTENTOS) {
          intentosRef.current += 1;
          const delay = intentosRef.current * 800; // 800ms, 1600ms, 2400ms
          setTimeout(() => {
            if (mounted) configurarYReproducir();
          }, delay);
        }
      }
    };

    // Pequeño delay inicial para asegurar que el componente
    // está completamente montado antes de iniciar el audio
    const timer = setTimeout(configurarYReproducir, 300);

    return () => {
      mounted = false;
      clearTimeout(timer);
      removerListeners();
      // Limpieza al desmontar
      if (soundRef.current) {
        soundRef.current.stopAsync()
          .then(() => soundRef.current?.unloadAsync())
          .catch(() => {});
        soundRef.current = null;
      }
    };
  }, [volumen]);
}