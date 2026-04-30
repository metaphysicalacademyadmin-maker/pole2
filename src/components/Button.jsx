import MuiButton from '@mui/material/Button';

// Wrapper around MUI Button with our default sizing/spacing.
// Variants:  primary (filled gold) | secondary (outlined) | ghost (text)
const VARIANT_MAP = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'outlined', color: 'inherit' },
  ghost: { variant: 'text', color: 'inherit' },
};

export default function Button({ children, onClick, variant = 'primary', disabled = false, fullWidth = false }) {
  const props = VARIANT_MAP[variant] || VARIANT_MAP.primary;
  return (
    <MuiButton
      {...props}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      disableElevation
      sx={{ textTransform: 'none', fontWeight: 500 }}
    >
      {children}
    </MuiButton>
  );
}
