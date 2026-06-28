/**
 * animals.js
 * -----------------------------------------------------------------------
 * Catálogo de animales disponibles en el juego, cada uno asociado a
 * UN color fijo (igual que en la imagen de referencia: vaca azul,
 * pollo amarillo, rana verde, gallina roja).
 *
 * Si luego se agregan más animales (ej. cerdo rosado), solo se agrega
 * una entrada aquí y en levelsData.js se referencia por "id".
 * -----------------------------------------------------------------------
 */

export const ANIMALS_LIST = [
  {
    id: 'vaca',
    name: 'vaca',
    colorId: 'azul',
    image: require('../../assets/images/animals/vaca.png'),
  },
  {
    id: 'pato',
    name: 'pato',
    colorId: 'amarillo',
    image: require('../../assets/images/animals/pato.png'),
  },
  {
    id: 'rana',
    name: 'rana',
    colorId: 'verde',
    image: require('../../assets/images/animals/rana.png'),
  },
  {
    id: 'gallina',
    name: 'gallina',
    colorId: 'naranja',
    image: require('../../assets/images/animals/gallina.png'),
  },
];

/**
 * Busca la información de un animal por su id.
 * @param {string} animalId - ej. 'vaca'
 * @returns {object|undefined} objeto de animal o undefined si no existe
 */
export const getAnimalById = (animalId) =>
  ANIMALS_LIST.find((animal) => animal.id === animalId);

export default ANIMALS_LIST;