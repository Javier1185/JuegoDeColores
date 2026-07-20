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
import { Audio } from 'expo-av';
import { MUSIC } from '../constantes/configuracionAudio';

export default function useMusicaFondo(volumen = 0.35) {
  const soundRef = useRef(null);
  const intentosRef = useRef(0);
  const MAX_INTENTOS = 3;

  useEffect(() => {
    let mounted = true;

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

        const { sound } = await Audio.Sound.createAsync(
          MUSIC.background,
          {
            isLooping: true,
            volume: volumen,
            shouldPlay: true,
          }
        );

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        intentosRef.current = 0; // reset intentos al éxito
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