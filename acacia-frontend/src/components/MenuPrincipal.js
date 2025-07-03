// src/components/MenuPrincipal.js
import React from 'react';
import {
    Box,
    Button,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    PersonAdd as PersonAddIcon,
    PostAdd as PostAddIcon,
} from '@mui/icons-material';

function MenuPrincipal() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const quickActions = [
        {
            title: 'Registrar Investigador',
            description: 'Añade un nuevo investigador al sistema',
            icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
            action: () => navigate('/reg-investigador'),
            color: '#D09AC4',
            gradient: 'linear-gradient(135deg, #D09AC4 0%, #E6A4CF 100%)'
        },
        {
            title: 'Registrar Proyecto',
            description: 'Registra un proyecto de investigación',
            icon: <PostAddIcon sx={{ fontSize: 40 }} />,
            action: () => navigate('/reg-proyecto'),
            color: '#EED3E3',
            gradient: 'linear-gradient(135deg, #EED3E3 0%, #F3C6E0 100%)'
        }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F8F0F5 0%, #EED3E3 50%, #D09AC4 100%)',
            py: 4
        }}>
            <Container maxWidth="lg">
                <Fade in={true} timeout={800}>
                    <Box>
                        {/* Header + Logout */}
                        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative' }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: '#2c1810',
                                    mb: 2,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                Bienvenido al Centro Acacia
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#4a3325',
                                    fontWeight: 400,
                                    opacity: 0.9,
                                    maxWidth: 600,
                                    mx: 'auto',
                                    lineHeight: 1.6
                                }}
                            >
                                Sistema integral de gestión para investigadores y proyectos académicos
                            </Typography>

                            {/* Botón Logout */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={handleLogout}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    mt: 1,
                                    mr: 1,
                                    fontWeight: 600,
                                    bgcolor: 'white',
                                    borderColor: '#2c1810',
                                    color: '#2c1810',
                                    '&:hover': {
                                        bgcolor: '#2c1810',
                                        color: 'white',
                                    }
                                }}
                            >
                                Cerrar sesión
                            </Button>
                        </Box>

                        {/* Acciones principales */}
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Fade in={true} timeout={1000 + (index * 200)}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                background: action.gradient,
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: 4,
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: `0 20px 40px ${action.color}40`,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'rgba(255,255,255,0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    zIndex: 0
                                                }
                                            }}
                                            onClick={action.action}
                                        >
                                            <CardContent sx={{
                                                p: 4,
                                                position: 'relative',
                                                zIndex: 1,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2
                                                }}>
                                                    <Box sx={{
                                                        p: 2,
                                                        bgcolor: 'rgba(255,255,255,0.2)',
                                                        borderRadius: 3,
                                                        mr: 2,
                                                        backdropFilter: 'blur(10px)'
                                                    }}>
                                                        {action.icon}
                                                    </Box>
                                                    <Typography
                                                        variant="h5"
                                                        fontWeight={600}
                                                        color="#2c1810"
                                                    >
                                                        {action.title}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: '#4a3325',
                                                        lineHeight: 1.6,
                                                        flex: 1
                                                    }}
                                                >
                                                    {action.description}
                                                </Typography>
                                            </CardContent>

                                            <CardActions sx={{
                                                p: 3,
                                                pt: 0,
                                                position: 'relative',
                                                zIndex: 1
                                            }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    sx={{
                                                        bgcolor: 'rgba(44, 24, 16, 0.9)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        backdropFilter: 'blur(10px)',
                                                        '&:hover': {
                                                            bgcolor: '#2c1810',
                                                            transform: 'scale(1.02)'
                                                        }
                                                    }}
                                                    onClick={action.action}
                                                >
                                                    Comenzar
                                                </Button>
                                            </CardActions>

                                            {/* Decorative circles */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    right: -20,
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    zIndex: 0
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -30,
                                                    left: -30,
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    zIndex: 0
                                                }}
                                            />
                                        </Card>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Footer info */}
                        <Box sx={{
                            textAlign: 'center',
                            mt: 6,
                            p: 3,
                            borderRadius: 3,
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Typography
                                variant="body2"
                                color="#4a3325"
                                opacity={0.8}
                            >
                                Universidad Distrital Francisco José de Caldas • Centro de Investigación Acacia
                            </Typography>
                            <Typography
                                variant="caption"
                                color="#4a3325"
                                opacity={0.6}
                                sx={{ mt: 0.5, display: 'block' }}
                            >
                                Sistema desarrollado para la gestión integral de proyectos de investigación
                            </Typography>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
}

export default MenuPrincipal;
