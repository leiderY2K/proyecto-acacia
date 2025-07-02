// src/components/InvestigadorForm.js
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
    FormLabel,
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
import {
    Add as AddIcon,
    Check as CheckIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Group as GroupIcon,
    Notes as NotesIcon,
} from '@mui/icons-material';
import { investigadoresService } from '../services/InvestigadoresService';
import { dataService } from '../services/dataService';

// Estado inicial del formulario
const initialFormData = {
    nombre_completo: '',
    correo: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
    telefono: '',
    observaciones: '',
    id_estamento: '',
    id_facultad: '',
    modulos: [],
    grupos: []
};

// Estilos consistentes
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

function InvestigadorForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

    // Estados para datos de APIs
    const [estamentos, setEstamentos] = useState([]);
    const [facultades, setFacultades] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [modulos, setModulos] = useState([]);

    // Estados para diálogos
    const [openEstamentoDialog, setOpenEstamentoDialog] = useState(false);
    const [openFacultadDialog, setOpenFacultadDialog] = useState(false);

    // Estados para carga de datos
    const [loadingData, setLoadingData] = useState(true);
    const [dataError, setDataError] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoadingData(true);
                setDataError(null);

                const [estamentosData, facultadesData, gruposData, modulosData] = await Promise.all([
                    dataService.getEstamentos(),
                    dataService.getFacultades(),
                    dataService.getGrupos(),
                    dataService.getModulos()
                ]);

                setEstamentos(Array.isArray(estamentosData) ? estamentosData : []);
                setFacultades(Array.isArray(facultadesData) ? facultadesData : []);
                setGrupos(Array.isArray(gruposData) ? gruposData : []);
                setModulos(Array.isArray(modulosData) ? modulosData : []);

            } catch (err) {
                console.error('Error al cargar datos para el formulario de investigador:', err);
                setDataError('Error al cargar opciones para el formulario. Por favor, verifica la conexión con el servidor.');
                setEstamentos([]);
                setFacultades([]);
                setGrupos([]);
                setModulos([]);
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

    // Maneja los cambios en los checkboxes (Módulos y Grupos)
    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target; // 'name' será 'modulos' o 'grupos', 'value' será el ID del elemento
        setFormData(prev => {
            const currentArray = prev[name]; // Obtiene el array actual (modulos o grupos)
            if (checked) {
                // Si está marcado, añade el ID si no está ya presente
                return { ...prev, [name]: [...currentArray, value] };
            } else {
                // Si está desmarcado, quita el ID del array
                return { ...prev, [name]: currentArray.filter(item => item !== value) };
            }
        });
        if (submitStatus.success !== null) {
            setSubmitStatus({ success: null, message: '' });
        }
    };

    const handleSelectOption = (field, id) => {
        setFormData(prev => ({ ...prev, [field]: id }));
        if (field === 'id_estamento') setOpenEstamentoDialog(false);
        if (field === 'id_facultad') setOpenFacultadDialog(false);
        if (submitStatus.success !== null) {
            setSubmitStatus({ success: null, message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSubmitStatus({ success: null, message: '' });

        if (!formData.nombre_completo || !formData.correo || !formData.id_estamento || !formData.id_facultad) {
            setSubmitStatus({ success: false, message: 'Por favor, complete los campos obligatorios: Nombre Completo, Correo, Estamento y Facultad.' });
            setLoading(false);
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                fecha_inicio: formData.fecha_inicio ? parseInt(formData.fecha_inicio, 10) : null,
                fecha_finalizacion: formData.fecha_finalizacion ? parseInt(formData.fecha_finalizacion, 10) : null,
            };

            await investigadoresService.createInvestigador(dataToSend);

            setSubmitStatus({ success: true, message: 'Investigador registrado exitosamente.' });
            setFormData(initialFormData);
        } catch (err) {
            const errorMessage = err.response && err.response.data && (err.response.data.detail || JSON.stringify(err.response.data));
            setSubmitStatus({ success: false, message: `Error al registrar investigador: ${errorMessage || err.message}` });
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

    // Función helper para comparar IDs de manera consistente
    const isSelected = (selectedId, itemId) => {
        // Convertir ambos a string para comparar de manera consistente
        return String(selectedId) === String(itemId);
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
                    Registrar Nuevo Investigador
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#666',
                        maxWidth: '600px',
                        mx: 'auto'
                    }}
                >
                    Complete la información del nuevo miembro del equipo de investigación
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
                            {/* Información de Contacto - Envuelto en una tarjeta */}
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#fafafa', mb: 2 }}>
                                    <CardContent sx={{ width: '800px', mx: 'auto' }}>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#A569BD', fontWeight: 'bold' }}>
                                            <PersonIcon sx={{ mr: 1 }} /> Información Personal
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#A569BD' }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Nombre Completo"
                                                    name="nombre_completo"
                                                    fullWidth
                                                    value={formData.nombre_completo}
                                                    onChange={handleChange}
                                                    sx={{ ...textFieldStyles }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Correo Electrónico"
                                                    name="correo"
                                                    fullWidth
                                                    value={formData.correo}
                                                    onChange={handleChange}
                                                    sx={{ ...textFieldStyles }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Teléfono"
                                                    name="telefono"
                                                    fullWidth
                                                    value={formData.telefono}
                                                    onChange={handleChange}
                                                    sx={{ ...textFieldStyles }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Clasificación y Fechas */}
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ backgroundColor: '#fafafa', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#4FC3F7', fontWeight: 'bold' }}>
                                            <SchoolIcon sx={{ mr: 1 }} /> Clasificación
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#4FC3F7' }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setOpenEstamentoDialog(true)}
                                                size="large"
                                                sx={{ ...selectButtonStyles }}
                                            >
                                                {`Estamento: ${getSelectionName(formData.id_estamento, estamentos, 'id_estamento', 'nombre_estamento')}`}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                onClick={() => setOpenFacultadDialog(true)}
                                                size="large"
                                                sx={{ ...selectButtonStyles }}
                                            >
                                                {`Facultad: ${getSelectionName(formData.id_facultad, facultades, 'id_facultad', 'nombre_facultad')}`}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Observaciones */}
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#fafafa', mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#8E44AD', fontWeight: 'bold' }}>
                                            <NotesIcon sx={{ mr: 1 }} /> Observaciones
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#8E44AD' }} />
                                        <TextField
                                            name="observaciones"
                                            label="Observaciones adicionales"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={formData.observaciones}
                                            onChange={handleChange}
                                            sx={{ ...textFieldStyles }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Asignación a Grupos y Módulos */}
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ backgroundColor: '#fafafa', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#D09AC4', fontWeight: 'bold' }}>
                                            <GroupIcon sx={{ mr: 1 }} /> Asignación
                                        </Typography>
                                        <Divider sx={{ mb: 3, backgroundColor: '#D09AC4' }} />

                                        {/* Sección de Checkboxes para Módulos */}
                                        <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
                                            <FormLabel component="legend" sx={{ color: '#666', fontWeight: 'bold' }}>Módulos</FormLabel>
                                            <FormGroup row> {/* Los checkboxes se muestran en una fila */}
                                                {Array.isArray(modulos) && modulos.map((modulo) => (
                                                    <FormControlLabel
                                                        key={modulo.id_modulo} // Usamos el ID único del módulo como clave
                                                        control={
                                                            <Checkbox
                                                                checked={formData.modulos.includes(modulo.id_modulo)} // Marca si el ID está en el array de `modulos` del formData
                                                                onChange={handleCheckboxChange}
                                                                name="modulos" // El nombre del campo en formData
                                                                value={modulo.id_modulo} // El valor que se añadirá/eliminará del array
                                                                sx={{ color: '#D09AC4', '&.Mui-checked': { color: '#A569BD' } }} // Estilos de los checkboxes
                                                            />
                                                        }
                                                        label={modulo.nombre_modulo} // El nombre visible del módulo
                                                    />
                                                ))}
                                            </FormGroup>
                                        </FormControl>

                                        {/* Sección de Checkboxes para Grupos */}
                                        <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
                                            <FormLabel component="legend" sx={{ color: '#666', fontWeight: 'bold' }}>Grupos de Investigación</FormLabel>
                                            <FormGroup row>
                                                {Array.isArray(grupos) && grupos.map((grupo) => (
                                                    <FormControlLabel
                                                        key={grupo.id_grupo}
                                                        control={
                                                            <Checkbox
                                                                checked={formData.grupos.includes(grupo.id_grupo)}
                                                                onChange={handleCheckboxChange}
                                                                name="grupos"
                                                                value={grupo.id_grupo}
                                                                sx={{ color: '#D09AC4', '&.Mui-checked': { color: '#A569BD' } }}
                                                            />
                                                        }
                                                        label={grupo.nombre_grupo}
                                                    />
                                                ))}
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
                                        {loading ? 'Registrando...' : 'Registrar Investigador'}
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
            <Dialog open={openEstamentoDialog} onClose={() => setOpenEstamentoDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#E8B4D6', color: '#333', fontSize: '1.4rem' }}>
                    Seleccionar Estamento
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: '300px' }}>
                    <List>
                        {Array.isArray(estamentos) && estamentos.map((estamento) => (
                            <ListItem disablePadding key={estamento.id_estamento}>
                                <ListItemButton
                                    onClick={() => handleSelectOption('id_estamento', estamento.id_estamento)}
                                    sx={{ py: 2, borderRadius: '8px', mb: 1 }}
                                >
                                    <ListItemText
                                        primary={estamento.nombre_estamento}
                                        primaryTypographyProps={{ fontSize: '1.1rem' }}
                                    />
                                    {isSelected(formData.id_estamento, estamento.id_estamento) && <CheckIcon color="primary" />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEstamentoDialog(false)} sx={{ color: '#A569BD', fontSize: '1.1rem' }}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFacultadDialog} onClose={() => setOpenFacultadDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#E8B4D6', color: '#333', fontSize: '1.4rem' }}>
                    Seleccionar Facultad
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: '300px' }}>
                    <List>
                        {Array.isArray(facultades) && facultades.map((facultad) => (
                            <ListItem disablePadding key={facultad.id_facultad}>
                                <ListItemButton
                                    onClick={() => handleSelectOption('id_facultad', facultad.id_facultad)}
                                    sx={{ py: 2, borderRadius: '8px', mb: 1 }}
                                >
                                    <ListItemText
                                        primary={facultad.nombre_facultad}
                                        primaryTypographyProps={{ fontSize: '1.1rem' }}
                                    />
                                    {isSelected(formData.id_facultad, facultad.id_facultad) && <CheckIcon color="primary" />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenFacultadDialog(false)} sx={{ color: '#A569BD', fontSize: '1.1rem' }}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

export default InvestigadorForm;