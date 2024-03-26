
'use client';
import typography from "./custom/typography";
import palette from "./custom/palette";
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette,
  typography: {
    fontFamily: typography.style.fontFamily,
  },
});

export default theme;