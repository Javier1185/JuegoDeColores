/**
 * theme.js
 * -----------------------------------------------------------------------
 * Tema visual centralizado del juego "La Granja de los Colores".
 * Inspirado en la imagen de referencia: paleta cálida tipo granja,
 * tarjetas blancas redondeadas, botones tipo madera y acentos vivos
 * para cada color enseñado.
 *
 * Cualquier ajuste de paleta, tipografía o espaciado debe hacerse AQUÍ
 * para mantener consistencia visual en todo el proyecto.
 * -----------------------------------------------------------------------
 */

// Paleta principal (fondo, marcos, texto)
export const PALETTE = {
  skyBlue: '#7EC8E3',
  grassGreen: '#6FCB6B',
  woodBrown: '#8B5A2B',
  woodBrownDark: '#6B431D',
  cream: '#FFF8E7',
  cardWhite: '#FFFFFF',
  textDark: '#3D2B1F',
  textLight: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.15)',
  overlayDark: 'rgba(0, 0, 0, 0.55)',
  starGold: '#FFC93C',
  starEmpty: '#E0E0E0',
  success: '#5FCB6B',
  error: '#FF6B6B',
};

// Colores que el juego enseña (deben coincidir con los audios y animales)
export const GAME_COLORS = {
  azul: '#2E86DE',
  rojo: '#E74C3C',
  verde: '#27AE60',
  amarillo: '#F1C40F',
};

// Tipografía: "Baloo 2" es una fuente VARIABLE (un solo archivo cubre
// todos los pesos). El peso se controla con "fontWeight" en los estilos,
// no con nombres de familia distintos.
export const FONTS = {
  family: 'Baloo2',
  fallback: 'System',
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

export const FONT_SIZES = {
  title: 42,
  subtitle: 24,
  button: 22,
  body: 18,
  small: 14,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  small: 12,
  medium: 20,
  large: 32,
  pill: 999,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
};

export default {
  PALETTE,
  GAME_COLORS,
  FONTS,
  FONT_WEIGHTS,
  FONT_SIZES,
  SPACING,
  RADIUS,
  SHADOWS,
};