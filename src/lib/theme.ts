import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

// Export des couleurs du thème avec types
export const theme = {
  colors: fullConfig.theme?.colors as any,
}

// Helper pour accéder facilement aux couleurs primary
export const colors = {
  primary: {
    DEFAULT: theme.colors.primary.DEFAULT || theme.colors.primary,
    50: theme.colors.primary[50],
    100: theme.colors.primary[100],
    200: theme.colors.primary[200],
    300: theme.colors.primary[300],
    400: theme.colors.primary[400],
    500: theme.colors.primary[500],
    600: theme.colors.primary[600],
    700: theme.colors.primary[700],
    800: theme.colors.primary[800],
    900: theme.colors.primary[900],
  },
  light: theme.colors.light,
  gray: theme.colors.gray,
  white: theme.colors.white,
  black: theme.colors.black,
}