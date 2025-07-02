import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Grid,
    Paper,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { proyectosService } from '../services/ProyectosService';
import { dataService } from '../services/dataService';
import { Stack } from '@mui/material';

const initialFormData = {
    nombre_proyecto: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
    enlace: '',
    recursos_utilizados: '',
    anexo: '',
    id_tipo_proyecto: '',
    id_grupo: '',
    id_estado: '',
    investigadores: []
};

function ProyectoForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

    const [tiposProyecto, setTiposProyecto] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [investigadores, setInvestigadores] = useState([]);

    const [openTipoProyectoDialog, setOpenTipoProyectoDialog] = useState(false);
    const [openGrupoDialog, setOpenGrupoDialog] = useState(false);
    const [openEstadoDialog, setOpenEstadoDialog] = useState(false);

    const [loadingData, setLoadingData] = useState(true);
    const [dataError, setDataError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoadingData(true);
                setDataError(null);

                const [tiposData, gruposData, estadosData, investigadoresData] = await Promise.all([
                    dataService.getTiposProyecto(),
                    dataService.getGrupos(),
                    dataService.getEstados(),
                    dataService.getInvestigadores()
                ]);

                setTiposProyecto(Array.isArray(tiposData) ? tiposData : []);
                setGrupos(Array.isArray(gruposData) ? gruposData : []);
                setEstados(Array.isArray(estadosData) ? estadosData : []);
                setInvestigadores(Array.isArray(investigadoresData) ? investigadoresData : []);

            } catch (err) {
                console.error('Error al cargar datos para el formulario de proyecto:', err);
                setDataError('Error al cargar opciones para el formulario de proyecto. Por favor, verifica la conexión con el servidor.');
                setTiposProyecto([]);
                setGrupos([]);
                setEstados([]);
                setInvestigadores([]);
            } finally {
                setLoadingData(false);
            }
        };
        fetchAllData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (submitStatus.success !== null) {
            setSubmitStatus({ success: null, message: '' });
        }
    };

    const handleInvestigadorCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentArray = prev.investigadores;
            if (checked) {
                return { ...prev, investigadores: [...currentArray, parseInt(value, 10)] };
            } else {
                return { ...prev, investigadores: currentArray.filter(item => item !== parseInt(value, 10)) };
            }
        });
        if (submitStatus.success !== null) {
            setSubmitStatus({ success: null, message: '' });
        }
    };

    const handleSelectOption = (field, id) => {
        setFormData(prev => ({ ...prev, [field]: id }));
        if (field === 'id_tipo_proyecto') setOpenTipoProyectoDialog(false);
        if (field === 'id_grupo') setOpenGrupoDialog(false);
        if (field === 'id_estado') setOpenEstadoDialog(false);
        if (submitStatus.success !== null) {
            setSubmitStatus({ success: null, message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSubmitStatus({ success: null, message: '' });

        if (!formData.nombre_proyecto || !formData.id_tipo_proyecto || !formData.id_grupo || !formData.id_estado) {
            setSubmitStatus({ success: false, message: 'Por favor, complete los campos obligatorios: Nombre del Proyecto, Tipo de Proyecto, Grupo y Estado.' });
            setLoading(false);
            return;
        }
        if (formData.investigadores.length === 0) {
            setSubmitStatus({ success: false, message: 'Debe seleccionar al menos un investigador para el proyecto.' });
            setLoading(false);
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                fecha_inicio: formData.fecha_inicio ? parseInt(formData.fecha_inicio, 10) : null,
                fecha_finalizacion: formData.fecha_finalizacion ? parseInt(formData.fecha_finalizacion, 10) : null,
            };

            await proyectosService.createProyecto(dataToSend);

            setSubmitStatus({ success: true, message: 'Proyecto registrado exitosamente.' });
            setFormData(initialFormData);
        } catch (err) {
            const errorMessage = err.response && err.response.data && (err.response.data.detail || JSON.stringify(err.response.data));
            setSubmitStatus({ success: false, message: `Error al registrar proyecto: ${errorMessage || err.message}` });
        } finally {
            setLoading(false);
        }
    };

    const getSelectionName = (id, options, idKey, nameKey, defaultValue = 'Seleccionar...') => {
        if (!Array.isArray(options) || options.length === 0) {
            return defaultValue;
        }
        const selected = options.find(option => option[idKey] === id);
        return selected ? selected[nameKey] : defaultValue;
    };

    if (loadingData) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                p: 4
            }}>
                <CircularProgress size={50} sx={{ color: '#D09AC4' }} />
                <Typography variant="h6" sx={{ mt: 3, color: '#333' }}>Cargando datos del formulario...</Typography>
            </Box>
        );
    }

    if (dataError) {
        return (
            <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
                <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
                    {dataError}
                </Alert>
            </Box>
        );
    }

    const submitButtonStyles = {
        backgroundColor: '#A569BD',
        borderRadius: '25px',
        px: 4,
        py: 2,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&:hover': { backgroundColor: '#8E44AD' },
        '&.Mui-disabled': {
            backgroundColor: '#D09AC4',
            color: '#fff',
            opacity: 0.7
        }
    };


    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            py: 1,
            px: { xs: 2, sm: 3, md: 4 }
        }}>
            {/* Header */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        color: '#333',
                        fontWeight: 'bold',
                        mb: 0.5,
                        fontSize: { xs: '2rem', md: '3rem' }
                    }}
                >
                    Registrar Nuevo Proyecto
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#666',
                        maxWidth: '600px',
                        mx: 'auto'
                    }}
                >
                    Complete la información del proyecto de investigación
                </Typography>
            </Box>

            {/* Main Form Container */}
            <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '2px solid #4FC3F7'
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ p: { xs: 3, md: 4 } }}
                    >
                        <Grid container spacing={4}>
                            {/* Información Básica - Envuelto en un Grid item para la tarjeta */}
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#fafafa', mb: 2 }}>
                                    <CardContent sx={{ width: '800px', mx: 'auto' }}>                                        <Typography variant="h5" gutterBottom sx={{ color: '#A569BD', fontWeight: 'bold' }}>
                                        📋 Información Básica
                                    </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#A569BD' }} />

                                        {/* Fila 1: Nombre del Proyecto (full width) */}
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nombre del Proyecto"
                                                name="nombre_proyecto"
                                                fullWidth
                                                value={formData.nombre_proyecto}
                                                onChange={handleChange}
                                                sx={{ mb: 2, ...textFieldStyles }}
                                            />
                                        </Grid>

                                        {/* Fila 2: Enlace (URL) (full width) */}
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Enlace (URL)"
                                                name="enlace"
                                                fullWidth
                                                value={formData.enlace}
                                                onChange={handleChange}
                                                sx={{ mb: 2, ...textFieldStyles }}
                                            />
                                        </Grid>
                                        {/* Fila 3: Fechas*/}
                                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ width: '100%' }}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    name="fecha_inicio"
                                                    label="Año de Inicio"
                                                    type="number"
                                                    variant="outlined"
                                                    value={formData.fecha_inicio || ''}
                                                    onChange={handleChange}
                                                    inputProps={{ min: "1900", max: "2100", step: "1" }}
                                                    sx={{ ...textFieldStyles, width: '250px'  }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    name="fecha_finalizacion"
                                                    label="Año de Finalización"
                                                    type="number"
                                                    variant="outlined"
                                                    value={formData.fecha_finalizacion || ''}
                                                    onChange={handleChange}
                                                    inputProps={{ min: "1900", max: "2100", step: "1" }}
                                                    sx={{ ...textFieldStyles }}
                                                />
                                            </Grid>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Detalles Adicionales */}
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ backgroundColor: '#fafafa', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#4FC3F7', fontWeight: 'bold' }}>
                                            📄 Detalles Adicionales
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#4FC3F7' }} />

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <TextField
                                                name="recursos_utilizados"
                                                label="Recursos Utilizados"
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={formData.recursos_utilizados}
                                                onChange={handleChange}
                                                sx={{ ...textFieldStyles }}
                                            />

                                            <TextField
                                                name="anexo"
                                                label="Anexo (Documentación técnica, etc.)"
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={formData.anexo}
                                                onChange={handleChange}
                                                sx={{ ...textFieldStyles }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Clasificación y Asignación */}
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ backgroundColor: '#fafafa', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#D09AC4', fontWeight: 'bold' }}>
                                            🏷️ Clasificación
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#D09AC4' }} />

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setOpenTipoProyectoDialog(true)}
                                                size="large"
                                                sx={{ ...selectButtonStyles }}
                                            >
                                                {`Tipo de Proyecto: ${getSelectionName(formData.id_tipo_proyecto, tiposProyecto, 'id_tipo_proyecto', 'nombre_tipo_proyecto')}`}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                onClick={() => setOpenGrupoDialog(true)}
                                                size="large"
                                                sx={{ ...selectButtonStyles }}
                                            >
                                                {`Grupo de Investigación: ${getSelectionName(formData.id_grupo, grupos, 'id_grupo', 'nombre_grupo')}`}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                onClick={() => setOpenEstadoDialog(true)}
                                                size="large"
                                                sx={{ ...selectButtonStyles }}
                                            >
                                                {`Estado del Proyecto: ${getSelectionName(formData.id_estado, estados, 'id_estado', 'nombre_estado')}`}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Investigadores */}
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#fafafa' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#8E44AD', fontWeight: 'bold' }}>
                                            👥 Investigadores
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#8E44AD' }} />

                                        <FormControl component="fieldset" variant="standard" fullWidth>
                                            <FormGroup>
                                                <Grid container spacing={2}>
                                                    {Array.isArray(investigadores) && investigadores.map((investigador) => (
                                                        <Grid item xs={12} sm={6} lg={4} key={investigador.id_investigador}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formData.investigadores.includes(investigador.id_investigador)}
                                                                        onChange={handleInvestigadorCheckboxChange}
                                                                        name="investigadores"
                                                                        value={investigador.id_investigador}
                                                                        sx={{ color: '#D09AC4', '&.Mui-checked': { color: '#A569BD' } }}
                                                                    />
                                                                }
                                                                label={investigador.nombre_completo}
                                                                sx={{
                                                                    backgroundColor: 'white',
                                                                    borderRadius: '8px',
                                                                    p: 1,
                                                                    m: 0,
                                                                    width: '100%',
                                                                    border: '1px solid #e0e0e0',
                                                                    '&:hover': {
                                                                        backgroundColor: '#f5f5f5'
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </FormGroup>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Submit Button and Status */}
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', pt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                        disabled={loading}
                                        sx={{
                                            ...submitButtonStyles,
                                            minWidth: '300px',
                                            fontSize: '1.2rem',
                                            py: 2
                                        }}
                                    >
                                        {loading ? 'Registrando...' : 'Registrar Proyecto'}
                                    </Button>
                                </Box>

                                {submitStatus.success !== null && (
                                    <Box sx={{ mt: 3, maxWidth: '600px', mx: 'auto' }}>
                                        <Alert
                                            severity={submitStatus.success ? "success" : "error"}
                                            sx={{
                                                fontSize: '1.1rem',
                                                '& .MuiAlert-message': { width: '100%' }
                                            }}
                                        >
                                            {submitStatus.message}
                                        </Alert>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box >

            {/* Dialogs */}
            <Dialog Dialog open={openTipoProyectoDialog} onClose={() => setOpenTipoProyectoDialog(false)
            } maxWidth="md" fullWidth >
                <DialogTitle sx={{ backgroundColor: '#E8B4D6', color: '#333', fontSize: '1.4rem' }}>
                    Seleccionar Tipo de Proyecto
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: '300px' }}>
                    <List>
                        {Array.isArray(tiposProyecto) && tiposProyecto.map((tipo) => (
                            <ListItem disablePadding key={tipo.id_tipo_proyecto}>
                                <ListItemButton
                                    onClick={() => handleSelectOption('id_tipo_proyecto', tipo.id_tipo_proyecto)}
                                    sx={{ py: 2, borderRadius: '8px', mb: 1 }}
                                >
                                    <ListItemText
                                        primary={tipo.nombre_tipo_proyecto}
                                        primaryTypographyProps={{ fontSize: '1.1rem' }}
                                    />
                                    {formData.id_tipo_proyecto === tipo.id_tipo_proyecto && <CheckIcon color="primary" />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenTipoProyectoDialog(false)} sx={{ color: '#A569BD', fontSize: '1.1rem' }}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog >

            <Dialog open={openGrupoDialog} onClose={() => setOpenGrupoDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#E8B4D6', color: '#333', fontSize: '1.4rem' }}>
                    Seleccionar Grupo de Investigación
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: '300px' }}>
                    <List>
                        {Array.isArray(grupos) && grupos.map((grupo) => (
                            <ListItem disablePadding key={grupo.id_grupo}>
                                <ListItemButton
                                    onClick={() => handleSelectOption('id_grupo', grupo.id_grupo)}
                                    sx={{ py: 2, borderRadius: '8px', mb: 1 }}
                                >
                                    <ListItemText
                                        primary={grupo.nombre_grupo}
                                        primaryTypographyProps={{ fontSize: '1.1rem' }}
                                    />
                                    {formData.id_grupo === grupo.id_grupo && <CheckIcon color="primary" />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenGrupoDialog(false)} sx={{ color: '#A569BD', fontSize: '1.1rem' }}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEstadoDialog} onClose={() => setOpenEstadoDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#E8B4D6', color: '#333', fontSize: '1.4rem' }}>
                    Seleccionar Estado del Proyecto
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: '300px' }}>
                    <List>
                        {Array.isArray(estados) && estados.map((estado) => (
                            <ListItem disablePadding key={estado.id_estado}>
                                <ListItemButton
                                    onClick={() => handleSelectOption('id_estado', estado.id_estado)}
                                    sx={{ py: 2, borderRadius: '8px', mb: 1 }}
                                >
                                    <ListItemText
                                        primary={estado.nombre_estado}
                                        primaryTypographyProps={{ fontSize: '1.1rem' }}
                                    />
                                    {formData.id_estado === estado.id_estado && <CheckIcon color="primary" />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEstadoDialog(false)} sx={{ color: '#A569BD', fontSize: '1.1rem' }}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

// Estilos actualizados
const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#EED3E3',
        borderRadius: '8px',
        fontSize: '1.1rem',
        '& fieldset': { borderColor: 'transparent' },
        '&:hover fieldset': { borderColor: '#D09AC4' },
        '&.Mui-focused fieldset': { borderColor: '#A569BD' },
    },
    '& .MuiInputBase-input': { color: '#333' },
    '& .MuiInputLabel-root': { color: '#666', fontSize: '1.1rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#A569BD' },
};

const selectButtonStyles = {
    borderColor: '#A569BD',
    color: '#A569BD',
    '&:hover': {
        borderColor: '#8E44AD',
        color: '#8E44AD',
        backgroundColor: '#f8f9fa'
    },
    py: 2,
    px: 3,
    textTransform: 'none',
    justifyContent: 'flex-start',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '2px solid',
};

export default ProyectoForm;