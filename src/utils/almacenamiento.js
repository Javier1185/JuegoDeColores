/**
 * almacenamiento.js
 * -----------------------------------------------------------------------
 * Maneja la persistencia local del progreso del jugador usando
 * AsyncStorage. Guarda un contador simple de estrellas totales que
 * se va sumando cada vez que el jugador acierta, sin límite ni tope
 * por nivel: el total crece indefinidamente y se mantiene aunque el
 * jugador cierre la app.
 * -----------------------------------------------------------------------
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_ESTRELLAS_TOTALES = '@granja_colores:estrellas_totales';

/**
 * Lee el total de estrellas acumuladas hasta ahora.
 * Si no hay nada guardado todavía, devuelve 0.
 */
export async function obtenerEstrellasTotales() {
  try {
    const valor = await AsyncStorage.getItem(
      CLAVE_ESTRELLAS_TOTALES
    );
    return valor ? parseInt(valor, 10) || 0 : 0;
  } catch (error) {
    console.warn('Error leyendo estrellas totales:', error);
    return 0;
  }
}

/**
 * Suma "cantidad" estrellas al total acumulado y lo guarda.
 * Devuelve el nuevo total.
 *
 * @param {number} cantidad - Estrellas a sumar (por defecto 1).
 */
export async function incrementarEstrellasTotales(cantidad = 1) {
  try {
    const totalActual = await obtenerEstrellasTotales();
    const nuevoTotal = totalActual + cantidad;

    await AsyncStorage.setItem(
      CLAVE_ESTRELLAS_TOTALES,
      String(nuevoTotal)
    );

    return nuevoTotal;
  } catch (error) {
    console.warn('Error guardando estrellas totales:', error);
    return null;
  }
}

/**
 * Borra el total acumulado (útil para un botón de "reiniciar
 * progreso" en Configuración, si se desea en el futuro).
 */
export async function borrarEstrellasTotales() {
  try {
    await AsyncStorage.removeItem(CLAVE_ESTRELLAS_TOTALES);
  } catch (error) {
    console.warn('Error borrando estrellas totales:', error);
  }
}