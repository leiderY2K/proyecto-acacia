// src/components/InvestigadoresList.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';

// Importa el hook useInvestigadores que ya tienes definido
import { useInvestigadoresGpModulo as useInvestigadores } from '../hooks/useInvestigadoresGpModulo';

const ITEMS_PER_PAGE = 5; // Cantidad de filas por página en la tabla

function InvestigadoresList() {
    // Usa el hook useInvestigadores real para obtener los datos, estado de carga y error.
    const { investigadores, loading, error, refetch } = useInvestigadores();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInvestigadores, setFilteredInvestigadores] = useState([]);
    const [page, setPage] = useState(1);

    // Efecto para filtrar investigadores y resetear la paginación
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredInvestigadores(investigadores);
        } else {
            const filtered = investigadores.filter(inv =>
                inv.investigador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.estamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.grupo_investigacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.modulo?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredInvestigadores(filtered);
        }
        setPage(1);
    }, [searchTerm, investigadores]);

    // Lógica de paginación
    const totalPages = Math.ceil(filteredInvestigadores.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const investigadoresToDisplay = filteredInvestigadores.slice(startIndex, endIndex);

    // *** CORRECCIÓN: Definición de handleChangePage ***
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Mostrar estado de carga, error o la lista
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px'
                }}
            >
                <CircularProgress size={60} sx={{ color: '#D09AC4' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={refetch}>
                            Reintentar
                        </Button>
                    }
                >
                    Error al cargar los investigadores: {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                border: '3px solid #4FC3F7',
                borderRadius: '15px',
                margin: '20px'
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    mb: 3,
                    color: '#333',
                    fontWeight: 'bold'
                }}
            >
                Investigadores
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    alignItems: 'center'
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por nombre, estamento o grupo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#D09AC4' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#E8B4D6',
                            borderRadius: '25px',
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: '#D09AC4',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#D09AC4',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: '#333',
                            '&::placeholder': {
                                color: '#666',
                                opacity: 1,
                            },
                        },
                    }}
                />
            </Box>

            {filteredInvestigadores.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        {searchTerm ? 'No se encontraron investigadores que coincidan con la búsqueda.' : 'No hay investigadores disponibles.'}
                    </Typography>
                </Box>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <TableContainer>
                        <Table stickyHeader aria-label="tabla de investigadores">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#E8B4D6', color: '#333', fontWeight: 'bold', borderTopLeftRadius: '15px' }}>Nombre Completo</TableCell>
                                    <TableCell sx={{ backgroundColor: '#E8B4D6', color: '#333', fontWeight: 'bold' }}>Estamento</TableCell>
                                    <TableCell sx={{ backgroundColor: '#E8B4D6', color: '#333', fontWeight: 'bold' }}>Grupo de Investigación</TableCell>
                                    <TableCell sx={{ backgroundColor: '#E8B4D6', color: '#333', fontWeight: 'bold', borderTopRightRadius: '15px' }}>Módulo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {investigadoresToDisplay.map((investigador) => (
                                    <TableRow
                                        key={investigador.id_investigador}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: '#f9f9f9',
                                            },
                                            '&:nth-of-type(even)': {
                                                backgroundColor: '#EED3E3',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#F7D0E8',
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ color: '#333' }}>{investigador.investigador}</TableCell>
                                        <TableCell sx={{ color: '#333' }}>
                                            {investigador.estamento ? investigador.estamento : 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ color: '#333' }}>{investigador.grupo_investigacion || 'N/A'}</TableCell>
                                        <TableCell sx={{ color: '#333' }}>{investigador.modulo || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, backgroundColor: '#E8B4D6' }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handleChangePage} // Aquí es donde se hacía referencia sin definirla
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#333',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#A569BD !important',
                                    color: 'white !important',
                                },
                            }}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
}

export default InvestigadoresList;