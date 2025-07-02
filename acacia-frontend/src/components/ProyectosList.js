import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    InputAdornment,
    Chip,
    Avatar,
    Tooltip,
    Modal,
    IconButton
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Science as ScienceIcon,
    Psychology as PsychologyIcon,
    Biotech as BiotechIcon,
    Computer as ComputerIcon,
    Engineering as EngineeringIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useProyectos } from '../hooks/useProyectos';

const PROJECTS_PER_LOAD = 12;

function ProyectosList() {
    const { proyectos, loading, error, refetch } = useProyectos();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [displayCount, setDisplayCount] = useState(PROJECTS_PER_LOAD);
    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);
    const [filtros, setFiltros] = useState({ tipo: '', estado: '', modulo: '' });

    useEffect(() => {
        if (!proyectos || proyectos.length === 0) {
            setFilteredProyectos([]);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const tipoFilter = filtros.tipo.toLowerCase();
        const estadoFilter = filtros.estado.toLowerCase();
        const moduloFilter = filtros.modulo.toLowerCase();

        const filtered = proyectos.filter((proyecto) => {
            const cumpleBusqueda = searchTerm.trim() === '' || (
                proyecto.nombre_proyecto?.toLowerCase().includes(searchLower) ||
                proyecto.investigadores?.some((inv) =>
                    inv.nombre_completo?.toLowerCase().includes(searchLower)
                ) ||
                proyecto.tipo_proyecto?.nombre_tipo_proyecto?.toLowerCase().includes(searchLower) ||
                proyecto.estado?.nombre_estado?.toLowerCase().includes(searchLower) ||
                proyecto.modulos?.some((mod) =>
                    mod.nombre_modulo?.toLowerCase().includes(searchLower)
                )
            );

            const cumpleTipo = !tipoFilter || proyecto.tipo_proyecto?.nombre_tipo_proyecto?.toLowerCase().includes(tipoFilter);
            const cumpleEstado = !estadoFilter || proyecto.estado?.nombre_estado?.toLowerCase().includes(estadoFilter);
            const cumpleModulo = !moduloFilter || proyecto.modulos?.some(mod => mod.nombre_modulo?.toLowerCase().includes(moduloFilter));

            return cumpleBusqueda && cumpleTipo && cumpleEstado && cumpleModulo;
        });

        setFilteredProyectos(filtered);
        setDisplayCount(PROJECTS_PER_LOAD);
    }, [searchTerm, proyectos, filtros]);

    const handleLoadMore = () => {
        setDisplayCount((prev) => prev + PROJECTS_PER_LOAD);
    };

    const getProjectIcon = (tipoProyecto) => {
        const tipo = tipoProyecto?.toLowerCase() || '';
        if (tipo.includes('doctorado')) return <ScienceIcon />;
        if (tipo.includes('maestría')) return <PsychologyIcon />;
        if (tipo.includes('investigación')) return <BiotechIcon />;
        if (tipo.includes('tecnología')) return <ComputerIcon />;
        return <EngineeringIcon />;
    };

    const proyectosToShow = filteredProyectos.slice(0, displayCount);
    const hasMoreProjects = displayCount < filteredProyectos.length;

    return (
        <Box bgcolor="#f5f5f5" minHeight="100vh" p={4}>
            <Typography variant="h4" align="center" fontWeight={600} mb={4}>
                Proyectos de Investigación
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={4} flexDirection={{ xs: 'column', sm: 'row' }}>
                <TextField
                    variant="outlined"
                    placeholder="Buscar proyectos por nombre, investigador, tipo, estado o módulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<FilterIcon />}
                    onClick={() => setFiltrosVisibles(true)}
                    sx={{
                        backgroundColor: '#A569BD',
                        borderRadius: '25px',
                        px: 3,
                        py: 1.5,
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            backgroundColor: '#8E44AD',
                        },
                    }}
                >
                    Filtro
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                    <Typography variant="h6" ml={2}>Cargando proyectos...</Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }} action={
                    <Button color="inherit" size="small" onClick={refetch}>
                        Reintentar
                    </Button>
                }>
                    Error al cargar proyectos: {error}
                </Alert>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {proyectosToShow.map((proyecto) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={proyecto.id_proyecto}>
                                <Card
                                    onClick={() => setSelectedProyecto(proyecto)}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: '0.2s',
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 4 },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar
                                                sx={{ bgcolor: '#d1c4e9', width: 40, height: 40, mr: 1 }}
                                            >
                                                {getProjectIcon(proyecto.tipo_proyecto?.nombre_tipo_proyecto)}
                                            </Avatar>
                                            <Tooltip title={proyecto.nombre_proyecto} arrow placement="top">
                                                <Typography
                                                    variant="h6"
                                                    fontSize="1rem"
                                                    fontWeight={600}
                                                    lineHeight={1.3}
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 4,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {proyecto.nombre_proyecto}
                                                </Typography>
                                            </Tooltip>
                                        </Box>

                                        <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                            Investigadores:
                                        </Typography>
                                        {proyecto.investigadores?.map((inv) => (
                                            <Typography variant="body2" key={inv.id_investigador} sx={{ ml: 1 }}>
                                                • {inv.nombre_completo}
                                            </Typography>
                                        ))}

                                        <Box mt={2}>
                                            <Typography variant="body2" color="textSecondary"><strong>Tipo:</strong> {proyecto.tipo_proyecto?.nombre_tipo_proyecto}</Typography>
                                            <Typography variant="body2" color="textSecondary"><strong>Estado:</strong> {proyecto.estado?.nombre_estado}</Typography>
                                            <Typography variant="body2" color="textSecondary"><strong>Inicio:</strong> {proyecto.fecha_inicio}</Typography>
                                        </Box>

                                        {proyecto.modulos && proyecto.modulos.length > 0 && (
                                            <Box mt={2}>
                                                <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                                    Módulos:
                                                </Typography>
                                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                    {proyecto.modulos.map((modulo) => (
                                                        <Chip key={modulo.id_modulo} label={modulo.nombre_modulo} size="small" variant="outlined" />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {hasMoreProjects && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#7e57c2',
                                    '&:hover': { bgcolor: '#5e35b1' },
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    borderRadius: 2
                                }}
                                onClick={handleLoadMore}
                                startIcon={<FilterIcon />}
                            >
                                Cargar más proyectos
                            </Button>
                        </Box>
                    )}

                    <Modal
                        open={Boolean(selectedProyecto)}
                        onClose={() => setSelectedProyecto(null)}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Box
                            bgcolor="white"
                            p={4}
                            borderRadius={2}
                            maxWidth="600px"
                            width="90%"
                            boxShadow={5}
                            position="relative"
                        >
                            <IconButton
                                onClick={() => setSelectedProyecto(null)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>

                            {selectedProyecto && (
                                <>
                                    <Typography variant="h5" fontWeight={600} mb={2}>
                                        {selectedProyecto.nombre_proyecto}
                                    </Typography>
                                    <Typography variant="body1" mb={1}><strong>Tipo:</strong> {selectedProyecto.tipo_proyecto?.nombre_tipo_proyecto}</Typography>
                                    <Typography variant="body1" mb={1}><strong>Estado:</strong> {selectedProyecto.estado?.nombre_estado}</Typography>
                                    <Typography variant="body1" mb={2}><strong>Inicio:</strong> {selectedProyecto.fecha_inicio}</Typography>

                                    <Typography variant="body1" fontWeight={500}>Investigadores:</Typography>
                                    <ul>
                                        {selectedProyecto.investigadores?.map(inv => (
                                            <li key={inv.id_investigador}>{inv.nombre_completo}</li>
                                        ))}
                                    </ul>

                                    <Typography variant="body1" fontWeight={500} mt={2}>Módulos:</Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {selectedProyecto.modulos?.map((mod) => (
                                            <Chip key={mod.id_modulo} label={mod.nombre_modulo} variant="outlined" />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Modal>

                    <Modal
                        open={filtrosVisibles}
                        onClose={() => setFiltrosVisibles(false)}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Box bgcolor="white" p={4} borderRadius={2} maxWidth="500px" width="90%" boxShadow={5}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Filtrar proyectos
                            </Typography>

                            <TextField
                                fullWidth
                                label="Tipo de Proyecto"
                                value={filtros.tipo}
                                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Estado"
                                value={filtros.estado}
                                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Módulo"
                                value={filtros.modulo}
                                onChange={(e) => setFiltros({ ...filtros, modulo: e.target.value })}
                                sx={{ mb: 2 }}
                            />

                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Button onClick={() => setFiltrosVisibles(false)}>Cancelar</Button>
                                <Button variant="contained" onClick={() => setFiltrosVisibles(false)}>
                                    Aplicar Filtros
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </>
            )}
        </Box>
    );
}

export default ProyectosList;
