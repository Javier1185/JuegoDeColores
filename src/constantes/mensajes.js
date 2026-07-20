export const MENSAJES_CORRECTOS = [
  {
    texto: '¡Excelente trabajo!',
    audio: require('../../assets/audio/effects/correct.mp3'),
  },
  {
    texto: '¡Muy bien!',
    audio: require('../../assets/audio/effects/Muy bien .mp3'),
  },
  {
    texto: '¡Fantástico!',
    audio: require('../../assets/audio/effects/Fantastico.mp3'),
  },
];

export const MENSAJES_INCORRECTOS = [
  {
    texto: '¡Intenta una vez más!',
    audio: require('../../assets/audio/effects/intenta una vez mas .mp3'),
  },
  {
    texto: 'Vamos otra vez.',
    audio: require('../../assets/audio/effects/Vamos otra vez mas .mp3'),
  },
];

export function obtenerMensajeAleatorio(lista) {
  const posicion = Math.floor(
    Math.random() * lista.length
  );

  return lista[posicion];
}