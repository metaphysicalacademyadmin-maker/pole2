import { createTheme } from '@mui/material/styles';

// MUI theme — синхронізована з cosmic-палітрою з styles.css.
// Усі кольори тримаються тут і в :root (styles.css). Не дублюй у компонентах.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e8c476',          // gold
      light: '#ffe7a8',         // gold-warm
      dark: '#c89849',          // gold-deep
      contrastText: '#04020c',
    },
    secondary: {
      main: '#9fc8e8',          // потік / голос
    },
    background: {
      default: '#04020c',       // space-deep
      paper: '#150a24',         // space-shallow
    },
    text: {
      primary: '#fff7e0',       // ink-primary
      secondary: 'rgba(220, 200, 160, 0.78)',
    },
    divider: 'rgba(232, 196, 118, 0.32)',
  },
  typography: {
    // Manrope Variable для body — гуманістичний sans з повною кирилицею.
    // EB Garamond Variable для display (заголовки, ритуальні тексти) — серіф з повною кирилицею.
    // Обидва підключені через @fontsource у main.jsx. Cormorant Garamond прибрано (невидимий у normal weight).
    fontFamily: '"Manrope Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    h1: {
      fontFamily: '"EB Garamond Variable", Georgia, serif',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    h2: {
      fontFamily: '"EB Garamond Variable", Georgia, serif',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    h3: {
      fontFamily: '"EB Garamond Variable", Georgia, serif',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
