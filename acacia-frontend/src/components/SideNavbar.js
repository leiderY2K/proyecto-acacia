// src/components/SideNavbar.js
import imagenes from '../assets/imagenes.js';
import { Link, useLocation } from "react-router-dom"; // Outlet no se usa aquí directamente, pero Link y useLocation sí.

import {
    Drawer,
    Box,
    Typography,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StatisticsIcon from '@mui/icons-material/QueryStats';

const drawerWidth = 340;

function SideNavbar() {
    const location = useLocation();
    // Obtener la ruta actual para saber qué elemento resaltar
    // La ruta de inicio es '/', otras rutas son '/proyectos', '/investigadores', etc.
    const currentPath = location.pathname;

    // La lógica de displayText en SideNavbar no afecta la navegación.
    // Solo se utiliza para mostrar un texto en algún lugar del SideNavbar,
    // pero no es necesario para el funcionamiento de los botones de navegación.
    // Si quieres un título dinámico en algún otro lugar de la página principal
    // basado en la ruta, entonces es útil. Por ahora, lo mantenemos separado de la navegación.

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#D09AC4',
                    backgroundImage: `linear-gradient(to bottom, #D09AC4, #EED3E3)`,
                    color: '#333',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3
                },
            }}
            variant="permanent"
            anchor="left"
        >
            {/* ---------- Sección superior: Logos + Títulos ---------- */}
            <Box sx={{
                width: '100%',
                px: 3,
                pt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}>
                {/* Logos lado a lado */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Box
                        component="img"
                        src={imagenes[0]} // Asegúrate que 'imagenes' contenga las URLs correctas
                        alt="Logo Universidad Distrital"
                        sx={{ width: 80, height: 'auto' }}
                    />
                    <Box
                        component="img"
                        src={imagenes[1]} // Asegúrate que 'imagenes' contenga las URLs correctas
                        alt="Logo CADEP Acacia"
                        sx={{ width: 100, height: 'auto' }}
                    />
                </Box>

                {/* Títulos debajo de los logos */}
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: '#333', mb: 0 }}
                >
                    Centro Acacia
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#555', mt: 0.2 }}
                >
                    Conoce y comenta los diferentes proyectos!!!
                </Typography>
            </Box>

            {/* ---------- Sección de botones grandes ---------- */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    mt: 4
                }}
            >
                {/* Inicio */}
                <NavIconButton
                    icon={<HomeIcon sx={{ fontSize: 40 }} />}
                    label="Inicio"
                    to="/" // dirige a la ruta de inicio
                    selected={currentPath === '/'} // Compara con la ruta actual
                />

                {/* Investigadores */}
                <NavIconButton
                    icon={<PersonSearchIcon sx={{ fontSize: 40 }} />}
                    label="Investigadores"
                    to="/investigadores"
                    selected={currentPath === '/investigadores'}
                />

                {/* Proyectos */}
                <NavIconButton
                    icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
                    label="Proyectos"
                    to="/proyectos"
                    selected={currentPath === '/proyectos'} 
                />

                {/* Estadísticas */}
                <NavIconButton
                    icon={<StatisticsIcon sx={{ fontSize: 40 }} />}
                    label="Estadísticas"
                    to="/estadisticas"
                    selected={currentPath === '/estadisticas'}
                />
            </Box>

            {/* ------------ Espacio inferior-------------- */}
            <Box sx={{ mt: 4 }}>
                {/* Enlaces de redes o info adicional */}
            </Box>
        </Drawer>
    );
}

// Componente reutilizable para los botones cuadrados
// Recibe 'to' como nueva prop
function NavIconButton({ icon, label, to, selected = false }) {
    return (
        <ListItemButton
            component={Link} // Usa Link de react-router-dom
            to={to} // Pasa la ruta al Link
            sx={{
                backgroundColor: selected ? '#e6a4cf' : '#f3c6e0',
                borderRadius: '10px',
                width: 120,
                height: 90,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                    backgroundColor: '#e6a4cf'
                },
                mx: 'auto'
            }}
        >
            <ListItemIcon sx={{ color: selected ? '#fff' : '#333', minWidth: 0 }}>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={label}
                sx={{
                    textAlign: 'center',
                    color: selected ? '#fff' : '#333',
                    minWidth: 0,
                    mt: 0.5
                }}
            />
        </ListItemButton>
    );
}

export default SideNavbar;