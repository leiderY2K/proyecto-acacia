import React from 'react';
import imagenes from '../assets/imagenes';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function HomePage() {
const navigate = useNavigate();

    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            borderRadius: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}>
            <Box
                component="img"
                src={imagenes[2]}
                alt="Fondo"
                sx={{
                    width: '98%',
                    height: '80%',
                    objectFit: 'cover',
                    position: 'absolute',
                    zIndex: 0,
                    opacity: 0.65,
                    top: '-20px',
                    borderRadius: '25px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }}
            />
            {/* Botones con íconos posicionados */}
            <Box sx={{ position: 'absolute', top: '20%', left: '10%', zIndex: 1 }}>
                <Button startIcon={<img src={imagenes[10]} alt="Innova" width={34} />} variant="contained" color="acaciaPink"
                onClick={() => navigate('/proyectos?modulo=INN')}>
                    Innova
                </Button>
            </Box>

            <Box sx={{ position: 'absolute', top: '10%', left: '40%', zIndex: 1 }}>
                <Button startIcon={<img src={imagenes[3]} alt="Apoya" width={34} />} variant="contained" color="acaciaPink"
                onClick={() => navigate('/proyectos?modulo=APO')}>
                    Apoya
                </Button>
            </Box>

            <Box sx={{ position: 'absolute', top: '30%', left: '70%', zIndex: 1 }}>
                <Button startIcon={<img src={imagenes[4]} alt="Convoca" width={34} />} variant="contained" color="acaciaPink"
                onClick={() => navigate('/proyectos?modulo=CON')}>
                    Convoca
                </Button>
            </Box>

            <Box sx={{ position: 'absolute', top: '65%', left: '20%', zIndex: 1 }}>
                <Button startIcon={<img src={imagenes[5]} alt="Cultiva" width={34} />} variant="contained" color="acaciaPink"
                onClick={() => navigate('/proyectos?modulo=CUL')}>
                    Cultiva
                </Button>
            </Box>

            <Box sx={{ position: 'absolute', top: '60%', left: '50%', zIndex: 1 }}>
                <Button startIcon={<img src={imagenes[6]} alt="Empodera" width={34} />} variant="contained" color="acaciaPink"
                onClick={() => navigate('/proyectos?modulo=EMP')}>
                    Empodera
                </Button>
            </Box>
        </Box>
    );
}

export default HomePage;
