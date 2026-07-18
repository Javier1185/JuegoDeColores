/**
 * colors.js
 * -----------------------------------------------------------------------
 * Define los colores que el juego enseña, junto con:
 *  - su valor hexadecimal (para pintar UI si se necesita)
 *  - el nombre del audio que se reproduce al pedir ese color
 *  - el id del animal asociado a ese color en el nivel base
 *
 * Esto permite agregar o quitar colores sin tocar la lógica del juego,
 * solo editando esta lista.
 * -----------------------------------------------------------------------
 */

export const COLORS_LIST = [
  {
  id: 'azul',
  label: 'AZUL',
  hex: '#2E86DE',
  audio: require('../../assets/audio/colors/azul.mp3'),
},
{
  id: 'rojo',
  label: 'ROJO',
  hex: '#E74C3C',
  audio: require('../../assets/audio/colors/rojo.mp3'),
},
{
  id: 'verde',
  label: 'VERDE',
  hex: '#27AE60',
  audio: require('../../assets/audio/colors/verde.mp3'),
},
{
  id: 'amarillo',
  label: 'AMARILLO',
  hex: '#F1C40F',
  audio: require('../../assets/audio/colors/amarillo.mp3'),
},
{
  id: 'rosado',
  label: 'ROSADO',
  hex: '#FF69B4',
  audio: require('../../assets/audio/colors/rosado.mp3'),
},
{
  id: 'gris',
  label: 'GRIS',
  hex: '#7F8C8D',
  audio: require('../../assets/audio/colors/gris.mp3'),
},
{
  id: 'chocolate',
  label: 'CHOCOLATE',
  hex: '#8B4513',
  audio: require('../../assets/audio/colors/chocolate.mp3'),
},
];

/**
 * Busca la información de un color por su id.
 * @param {string} colorId - ej. 'azul'
 * @returns {object|undefined} objeto de color o undefined si no existe
 */
export const getColorById = (colorId) =>
  COLORS_LIST.find((color) => color.id === colorId);

export default COLORS_LIST;