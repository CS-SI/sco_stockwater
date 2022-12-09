import { createStitches } from '@stitches/react'

export const {
  styled,
  css,
  keyframes,
  getCssText,
  globalCss,
  theme,
  createTheme,
  config
} = createStitches({
  theme: {
    colors: {
      text: '#000000',
      background: '#ffffff',
      darkViolet: '#0e1247',
      violet: '#312783',
      cyan: '#00AAFF',
      white: '#FFFFFF',
      climate: '#008777',
      water: '#0082C2',
      ocean: '#004D7E',
      air: '#8BB7E2',
      land: '#94C11F',
      health: '#009D45',
      costal: '#009679',
      food: '#E0E622',
      disaster: '#E9483F',
      iconColor: '#A2B5BB',
      iconHoverColor: '#222222',
      sun: '#FFCD00',
      borderSelectedColor: '#222222',
      backgroundSelectedColor: '#E5E5E5'
    },
    fontSizes: {
      xxs: '8px',
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px'
    },
    space: {
      xs: '0.25rem',
      sm: '0.5rem',
      base: '1rem',
      lg: '2rem',
      xl: '4rem',
      xxl: '8rem'
    },
    borderRadius: {
      xs: '0.25rem',
      sm: '0.5rem',
      base: '1rem',
      lg: '2rem',
      xl: '4rem',
      xxl: '8rem'
    }
  },
  utils: {
    h: value => ({
      height: value
    })
  }
})

// define the dark theme using the de-constructed function
export const darkTheme = createTheme({
  colors: {
    background: '#0e1247',
    text: '#FFFFFF',
    iconColor: '#A2B5BB',
    iconHoverColor: '#FFFFFF',
    borderSelectedColor: '#FFFFFF',
    backgroundSelectedColor: '#1D2476'
  }
})

export const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box'
  },
  '*': {
    margin: '0'
  },
  'html, body': {
    height: '100%',
    background: '$background',
    color: '$text'
  },
  'body': {
    lineHeight: '1.5',
    webkitFontSmoothing: 'antialiased'
  },
  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%'
  },

  'input, button, textarea, select': {
    font: 'inherit'
  },
  'p, h1, h2, h3, h4, h5, h6': {
    overflowWrap: 'break-word'
  },
  '#root, #__next': {
    isolation: 'isolate'
  },
  '@font-face': [
    {
      fontFamily: 'montserrat',
      fontStyle: 'normal',
      fontWeight: 400,
      src: "url('/sco_stockwater/fonts/montserrat/montserrat-Regular.woff') format('woff')" /* Modern Browsers */
    },
    {
      fontDisplay: 'swap',
      fontFamily: 'arial',
      fontStyle: 'bold',
      fontWeight: '700',
      src: "url('/fonts/arial/arial_bold.woff') format('woff)"
    },
    {
      fontDisplay: 'swap',
      fontFamily: 'arial',
      fontStyle: 'italic',
      fontWeight: '700',
      src: "url('/fonts/arial/arial_bold_italic.woff') format('woff)"
    },
    {
      fontDisplay: 'swap',
      fontFamily: 'arial',
      fontStyle: 'italic',
      fontWeight: 'normal',
      src: "url('/fonts/arial/arial_italic.woff') format('woff)"
    },
    {
      fontDisplay: 'swap',
      fontFamily: 'arial',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('/fonts/arial/arial.woff') format('woff)"
    }
  ]
})
