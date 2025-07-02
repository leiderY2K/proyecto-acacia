// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Color primario por defecto (puedes cambiarlo)
        },
        secondary: {
            main: '#dc004e', // Color secundario por defecto (puedes cambiarlo)
        },
        // Puedes añadir un color personalizado si este rosa es único
        acaciaPink: { // Nombre personalizado para tu color
            main: '#f7c7e4',
            dark: '#e0b4d4', // Para hover
            light: '#c99cbe', // Para active
            contrastText: '#6a0f49', // Color del texto que contrasta
        },
    },
    components: {
        MuiButton: { // Aquí apuntas al componente Button de MUI
            styleOverrides: {
                // Esto aplica a todos los botones con variant="contained"
                contained: {
                    padding: '12px 24px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    fontSize: '18px',
                    '&:hover': {
                        boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                    },
                },
                // Estilos específicos si el botón usa el color personalizado 'acaciaPink'
                containedAcaciaPink: { // Combinación de variant y color
                    backgroundColor: '#f7c7e4',
                    color: '#6a0f49',
                    '&:hover': {
                        backgroundColor: '#e0b4d4', // Un rosa más oscuro para el hover
                    },
                    '&:active': {
                        backgroundColor: '#c99cbe', // Un rosa aún más oscuro para el active
                        boxShadow: 'none',
                    },
                },
            },
        },
    },
    typography: {
        button: { // Puedes ajustar la tipografía de todos los botones aquí
            textTransform: 'none', // Para evitar que el texto esté en mayúsculas por defecto
        },
    },
});

export default theme;