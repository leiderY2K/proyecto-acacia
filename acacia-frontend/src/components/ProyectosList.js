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
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Science as ScienceIcon,
    Psychology as PsychologyIcon,
    Biotech as BiotechIcon,
    Computer as ComputerIcon,
    Engineering as EngineeringIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';
import { useProyectos } from '../hooks/useProyectos';
import { useSearchParams } from 'react-router-dom';

const PROJECTS_PER_LOAD = 12;

function ProyectosList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [displayCount, setDisplayCount] = useState(PROJECTS_PER_LOAD);
    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);
    const [filtros, setFiltros] = useState({ tipo: '', estado: '', modulo: '' });
    const [searchParams] = useSearchParams();
    const moduloDesdeUrl = searchParams.get('modulo');

    const { proyectos, loading, error, refetch } = useProyectos(moduloDesdeUrl);

    // Obtener opciones únicas para los filtros
    const getOpcionesFiltro = () => {
        const tipos = [...new Set(proyectos.map(p => p.tipo_proyecto?.nombre_tipo_proyecto).filter(Boolean))];
        const estados = [...new Set(proyectos.map(p => p.estado?.nombre_estado).filter(Boolean))];
        const modulos = [...new Set(
            proyectos.flatMap(p =>
                p.investigadores?.flatMap(inv =>
                    inv.modulos?.map(mod => mod.nombre_modulo)
                ) || []
            ).filter(Boolean)
        )];

        return { tipos, estados, modulos };
    };

    const { tipos, estados, modulos } = getOpcionesFiltro();

    useEffect(() => {
        const searchLower = searchTerm.toLowerCase().trim();

        const filtered = proyectos.filter((proyecto) => {
            // Filtro de búsqueda
            const cumpleBusqueda = !searchLower || (
                proyecto.nombre_proyecto?.toLowerCase().includes(searchLower) ||
                proyecto.investigadores?.some((inv) =>
                    inv.nombre_completo?.toLowerCase().includes(searchLower)
                ) ||
                proyecto.tipo_proyecto?.nombre_tipo_proyecto?.toLowerCase().includes(searchLower) ||
                proyecto.estado?.nombre_estado?.toLowerCase().includes(searchLower) ||
                proyecto.investigadores?.some(inv =>
                    inv.modulos?.some(mod =>
                        mod.nombre_modulo?.toLowerCase().includes(searchLower)
                    )
                )
            );

            // Filtros específicos
            const cumpleTipo = !filtros.tipo || proyecto.tipo_proyecto?.nombre_tipo_proyecto === filtros.tipo;
            const cumpleEstado = !filtros.estado || proyecto.estado?.nombre_estado === filtros.estado;
            const cumpleModulo = !filtros.modulo || proyecto.investigadores?.some(inv =>
                inv.modulos?.some(mod => mod.nombre_modulo === filtros.modulo)
            );

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
        if (tipo.includes('tecnología') || tipo.includes('acción')) return <ComputerIcon />;
        return <EngineeringIcon />;
    };

    const getEstadoColor = (estado) => {
        const estadoLower = estado?.toLowerCase() || '';
        if (estadoLower.includes('finalizado')) return '#4caf50';
        if (estadoLower.includes('curso')) return '#ff9800';
        if (estadoLower.includes('pausa')) return '#f44336';
        return '#2196f3';
    };

    const proyectosToShow = filteredProyectos.slice(0, displayCount);
    const hasMoreProjects = displayCount < filteredProyectos.length;

    const getModulosUnicosDelProyecto = (proyecto) => {
        const modulosMap = new Map();
        proyecto.investigadores?.forEach(inv => {
            inv.modulos?.forEach(mod => {
                if (!modulosMap.has(mod.id_modulo)) {
                    modulosMap.set(mod.id_modulo, mod);
                }
            });
        });
        return Array.from(modulosMap.values());
    };

    const limpiarFiltros = () => {
        setFiltros({ tipo: '', estado: '', modulo: '' });
        setFiltrosVisibles(false);
    };

    return (
        <Box bgcolor="#f5f5f5" minHeight="100vh" p={4}>
            <Typography
                variant="h4"
                align="center"
                fontWeight={600}
                mb={4}
                sx={{ color: '#333', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
                Proyectos de Investigación
                {moduloDesdeUrl && (
                    <Typography variant="h6" color="textSecondary" mt={1}>
                        Filtrado por módulo: {moduloDesdeUrl}
                    </Typography>
                )}
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={4} flexDirection={{ xs: 'column', sm: 'row' }}>
                <TextField
                    variant="outlined"
                    placeholder="Buscar proyectos por nombre, investigador, tipo, estado o módulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#A569BD',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#A569BD',
                            },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
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
                        boxShadow: '0 4px 12px rgba(165, 105, 189, 0.3)',
                        '&:hover': {
                            backgroundColor: '#8E44AD',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(165, 105, 189, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    Filtros
                </Button>
            </Box>

            {/* Indicador de filtros activos */}
            {(filtros.tipo || filtros.estado || filtros.modulo) && (
                <Box mb={3} display="flex" flexWrap="wrap" gap={1} alignItems="center">
                    <Typography variant="body2" color="textSecondary" mr={1}>
                        Filtros activos:
                    </Typography>
                    {filtros.tipo && (
                        <Chip
                            label={`Tipo: ${filtros.tipo}`}
                            onDelete={() => setFiltros({ ...filtros, tipo: '' })}
                            color="primary"
                            size="small"
                        />
                    )}
                    {filtros.estado && (
                        <Chip
                            label={`Estado: ${filtros.estado}`}
                            onDelete={() => setFiltros({ ...filtros, estado: '' })}
                            color="primary"
                            size="small"
                        />
                    )}
                    {filtros.modulo && (
                        <Chip
                            label={`Módulo: ${filtros.modulo}`}
                            onDelete={() => setFiltros({ ...filtros, modulo: '' })}
                            color="primary"
                            size="small"
                        />
                    )}
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress sx={{ color: '#A569BD' }} />
                    <Typography variant="h6" ml={2} color="textSecondary">
                        Cargando proyectos...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={refetch}
                            sx={{ fontWeight: 600 }}
                        >
                            Reintentar
                        </Button>
                    }
                >
                    Error al cargar proyectos: {error}
                </Alert>
            ) : filteredProyectos.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="textSecondary" mb={2}>
                        No se encontraron proyectos
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Intenta ajustar los filtros de búsqueda
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box mb={3}>
                        <Typography variant="body1" color="textSecondary">
                            Mostrando {Math.min(displayCount, filteredProyectos.length)} de {filteredProyectos.length} proyectos
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {proyectosToShow.map((proyecto) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={proyecto.id_proyecto}>
                                <Card
                                    onClick={() => setSelectedProyecto(proyecto)}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        display: 'flex',
                                        backgroundColor: '#D09AC4',
                                        backgroundImage: 'linear-gradient(to bottom,rgb(233, 196, 225),rgb(240, 229, 236))',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 8px 25px rgba(165, 105, 189, 0.15)',
                                            transform: 'translateY(-4px)',
                                        },
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: `linear-gradient(90deg, #A569BD, #8E44AD)`,
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Box display="flex" alignItems="flex-start" mb={2}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: '#d1c4e9',
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2,
                                                    flexShrink: 0
                                                }}
                                            >
                                                {getProjectIcon(proyecto.tipo_proyecto?.nombre_tipo_proyecto)}
                                            </Avatar>
                                            <Box flexGrow={1} minWidth={0}>
                                                <Tooltip title={proyecto.nombre_proyecto} arrow placement="top">
                                                    <Typography
                                                        variant="h6"
                                                        fontSize="1rem"
                                                        fontWeight={600}
                                                        lineHeight={1.3}
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            color: '#333',
                                                        }}
                                                    >
                                                        {proyecto.nombre_proyecto}
                                                    </Typography>
                                                </Tooltip>
                                            </Box>
                                        </Box>

                                        <Box mb={2}>
                                            <Typography variant="body2" color="textSecondary" fontWeight={500} mb={1}>
                                                Investigadores:
                                            </Typography>
                                            {proyecto.investigadores?.slice(0, 2).map((inv) => (
                                                <Typography
                                                    variant="body2"
                                                    key={inv.id_investigador}
                                                    sx={{ ml: 1, color: '#555' }}
                                                >
                                                    • {inv.nombre_completo}
                                                </Typography>
                                            ))}
                                            {proyecto.investigadores?.length > 2 && (
                                                <Typography variant="body2" sx={{ ml: 1, color: '#777', fontStyle: 'italic' }}>
                                                    y {proyecto.investigadores.length - 2} más...
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box mb={2}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Tipo:</strong> {proyecto.tipo_proyecto?.nombre_tipo_proyecto}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Estado:</strong>
                                                </Typography>
                                                <Chip
                                                    label={proyecto.estado?.nombre_estado}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getEstadoColor(proyecto.estado?.nombre_estado),
                                                        color: 'white',
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Inicio:</strong> {proyecto.fecha_inicio}
                                            </Typography>
                                        </Box>

                                        {getModulosUnicosDelProyecto(proyecto).length > 0 && (
                                            <Box>
                                                <Typography variant="body2" color="textSecondary" fontWeight={500} mb={1}>
                                                    Módulos:
                                                </Typography>
                                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                    {getModulosUnicosDelProyecto(proyecto).map((modulo) => (
                                                        <Chip
                                                            key={modulo.id_modulo}
                                                            label={modulo.nombre_modulo}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: '#A569BD',
                                                                color: '#A569BD',
                                                                fontSize: '0.7rem',
                                                                height: '20px'
                                                            }}
                                                        />
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
                                    '&:hover': {
                                        bgcolor: '#5e35b1',
                                        transform: 'translateY(-2px)',
                                    },
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.3)',
                                    transition: 'all 0.3s ease',
                                }}
                                onClick={handleLoadMore}
                                startIcon={<ExpandMoreIcon />}
                            >
                                Cargar más proyectos ({filteredProyectos.length - displayCount} restantes)
                            </Button>
                        </Box>
                    )}

                    {/* Modal de detalle del proyecto */}
                    <Modal
                        open={Boolean(selectedProyecto)}
                        onClose={() => setSelectedProyecto(null)}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
                    >
                        <Box
                            bgcolor="white"
                            p={4}
                            borderRadius={3}
                            maxWidth="700px"
                            width="100%"
                            maxHeight="90vh"
                            overflow="auto"
                            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
                            position="relative"
                        >
                            <IconButton
                                onClick={() => setSelectedProyecto(null)}
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    bgcolor: '#f5f5f5',
                                    '&:hover': { bgcolor: '#e0e0e0' }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            {selectedProyecto && (
                                <>
                                    <Typography variant="h4" fontWeight={600} mb={3} pr={5} lineHeight={1.2}>
                                        {selectedProyecto.nombre_proyecto}
                                    </Typography>

                                    <Grid container spacing={3} mb={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body1" mb={1}>
                                                <strong>Tipo:</strong> {selectedProyecto.tipo_proyecto?.nombre_tipo_proyecto}
                                            </Typography>
                                            <Typography variant="body1" mb={1}>
                                                <strong>Estado:</strong>
                                                <Chip
                                                    label={selectedProyecto.estado?.nombre_estado}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getEstadoColor(selectedProyecto.estado?.nombre_estado),
                                                        color: 'white',
                                                        ml: 1,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body1" mb={1}>
                                                <strong>Fecha de inicio:</strong> {selectedProyecto.fecha_inicio}
                                            </Typography>
                                            {selectedProyecto.fecha_finalizacion && (
                                                <Typography variant="body1" mb={1}>
                                                    <strong>Fecha de finalización:</strong> {selectedProyecto.fecha_finalizacion}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" fontWeight={600} mb={2}>Investigadores:</Typography>
                                    <Grid container spacing={2} mb={3}>
                                        {selectedProyecto.investigadores?.map(inv => (
                                            <Grid item xs={12} md={6} key={inv.id_investigador}>
                                                <Box p={2} bgcolor="#f8f9fa" borderRadius={2}>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {inv.nombre_completo}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {inv.correo}
                                                    </Typography>
                                                    {inv.telefono && (
                                                        <Typography variant="body2" color="textSecondary">
                                                            Tel: {inv.telefono}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Typography variant="h6" fontWeight={600} mb={2}>Módulos:</Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                                        {getModulosUnicosDelProyecto(selectedProyecto).map((mod) => (
                                            <Chip
                                                key={mod.id_modulo}
                                                label={mod.nombre_modulo}
                                                variant="filled"
                                                sx={{
                                                    backgroundColor: '#A569BD',
                                                    color: 'white',
                                                    fontWeight: 500
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    {selectedProyecto.recursos_utilizados && (
                                        <>
                                            <Typography variant="h6" fontWeight={600} mb={2}>Recursos utilizados:</Typography>
                                            <Typography variant="body1" mb={3} p={2} bgcolor="#f8f9fa" borderRadius={2}>
                                                {selectedProyecto.recursos_utilizados}
                                            </Typography>
                                        </>
                                    )}

                                    {/* {selectedProyecto.anexo && (
                                        <>
                                            <Typography variant="h6" fontWeight={600} mb={2}>Información adicional:</Typography>
                                            <Typography variant="body1" mb={3} p={2} bgcolor="#f8f9fa" borderRadius={2}>
                                                {selectedProyecto.anexo}
                                            </Typography>
                                        </>
                                    )} */}

                                    {selectedProyecto?.anexo && (
                                        <Box mt={3} textAlign="center">
                                            <Button
                                                variant="contained"
                                                href={selectedProyecto.anexo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<LaunchIcon />}
                                                sx={{
                                                    backgroundColor: '#7e57c2',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    borderRadius: 3,
                                                    px: 4,
                                                    py: 1.5,
                                                    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.3)',
                                                    '&:hover': {
                                                        backgroundColor: '#5e35b1',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 16px rgba(126, 87, 194, 0.4)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                Información adicional
                                            </Button>
                                        </Box>
                                    )}

                                    {selectedProyecto?.enlace && (
                                        <Box mt={3} textAlign="center">
                                            <Button
                                                variant="contained"
                                                href={selectedProyecto.enlace}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<LaunchIcon />}
                                                sx={{
                                                    backgroundColor: '#7e57c2',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    borderRadius: 3,
                                                    px: 4,
                                                    py: 1.5,
                                                    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.3)',
                                                    '&:hover': {
                                                        backgroundColor: '#5e35b1',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 16px rgba(126, 87, 194, 0.4)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                Ver Proyecto Completo
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </Modal>

                    {/* Modal de filtros mejorado */}
                    <Modal
                        open={filtrosVisibles}
                        onClose={() => setFiltrosVisibles(false)}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
                    >
                        <Box
                            bgcolor="white"
                            p={4}
                            borderRadius={3}
                            maxWidth="500px"
                            width="100%"
                            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
                        >
                            <Typography variant="h5" fontWeight={600} mb={3}>
                                Filtrar proyectos
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Tipo de Proyecto</InputLabel>
                                <Select
                                    value={filtros.tipo}
                                    label="Tipo de Proyecto"
                                    onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                >
                                    <MenuItem value="">Todos los tipos</MenuItem>
                                    {tipos.map(tipo => (
                                        <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={filtros.estado}
                                    label="Estado"
                                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                >
                                    <MenuItem value="">Todos los estados</MenuItem>
                                    {estados.map(estado => (
                                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Módulo</InputLabel>
                                <Select
                                    value={filtros.modulo}
                                    label="Módulo"
                                    onChange={(e) => setFiltros({ ...filtros, modulo: e.target.value })}
                                >
                                    <MenuItem value="">Todos los módulos</MenuItem>
                                    {modulos.map(modulo => (
                                        <MenuItem key={modulo} value={modulo}>{modulo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box display="flex" justifyContent="space-between" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={limpiarFiltros}
                                    sx={{
                                        borderColor: '#A569BD',
                                        color: '#A569BD',
                                        '&:hover': {
                                            borderColor: '#8E44AD',
                                            backgroundColor: 'rgba(165, 105, 189, 0.04)'
                                        }
                                    }}
                                >
                                    Limpiar
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setFiltrosVisibles(false)}
                                    sx={{
                                        backgroundColor: '#A569BD',
                                        '&:hover': { backgroundColor: '#8E44AD' }
                                    }}
                                >
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