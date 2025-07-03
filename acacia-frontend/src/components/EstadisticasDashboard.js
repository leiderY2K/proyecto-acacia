import React from 'react';
import {
    Box,
    Typography,
    Alert,
    Grid,
    Paper,
    IconButton,
    Fade,
    Skeleton,
    useTheme
} from '@mui/material';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import {
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { useEstadisticas } from '../hooks/useEstadisticas';

const COLORS = [
    '#1976d2', '#388e3c', '#f57c00', '#d32f2f',
    '#7b1fa2', '#0097a7', '#689f38', '#e64a19'
];

const GRADIENT_COLORS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
];

const SummaryCard = ({ title, value, icon: Icon, trend, color = '#1976d2' }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                bgcolor: 'background.paper',
                p: 3,
                boxShadow: theme.shadows[2],
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: theme.shadows[6],
                    transform: 'translateY(-2px)',
                },
                height: '100%'
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
                        {value?.toLocaleString() ?? '0'}
                    </Typography>
                    {trend && (
                        <Box display="flex" alignItems="center" color="success.main">
                            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption" fontWeight={500}>
                                {trend}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${color}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon sx={{ fontSize: 28, color }} />
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 4,
                    bgcolor: color,
                }}
            />
        </Box>
    );
};

// Componente mejorado para gráficos de pie
const CustomPieChart = ({ data, title, dataKey, nameKey }) => {
    const total = data?.reduce((sum, item) => sum + (item[dataKey] || 0), 0) || 0;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / total) * 100).toFixed(1);
            return (
                <Paper sx={{ p: 1.5, boxShadow: 3 }}>
                    <Typography variant="body2" fontWeight={600}>
                        {data.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        {data.value} ({percentage}%)
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null;

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary" mb={2}>
                {title}
            </Typography>

            {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={CustomLabel}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey={dataKey}
                            nameKey={nameKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartTooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={320}>
                    <Typography variant="body2" color="text.secondary">
                        No hay datos disponibles
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

// Componente mejorado para gráficos de barras
const CustomBarChart = ({ data, title, dataKey, nameKey }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 1.5, boxShadow: 3 }}>
                    <Typography variant="body2" fontWeight={600}>
                        {label}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Total: {payload[0].value}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    const renderCustomLegend = () => (
        <Box ml={3}>
            {data.map((entry, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                    <Box
                        sx={{
                            width: 16,
                            height: 16,
                            bgcolor: COLORS[index % COLORS.length],
                            borderRadius: '4px',
                            mr: 1
                        }}
                    />
                    <Typography variant="body2">{entry[nameKey]}</Typography>
                </Box>
            ))}
        </Box>
    );

    return (
        <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary" mb={2}>
                {title}
            </Typography>

            {data && data.length > 0 ? (
                <Box display="flex">
                    <ResponsiveContainer width="80%" height={320}>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey={nameKey} tick={false} axisLine={true} tickLine={true}
                            />

                            <YAxis allowDecimals={false} />
                            <RechartTooltip content={<CustomTooltip />} />
                            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Leyenda personalizada */}
                    <Box width="20%" display="flex" alignItems="center">
                        {renderCustomLegend()}
                    </Box>
                </Box>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={320}>
                    <Typography variant="body2" color="text.secondary">
                        No hay datos disponibles
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

// Componente principal del dashboard
function EstadisticasDashboard() {
    const { datos, loading, error, refetch } = useEstadisticas();

    if (loading) {
        return (
            <Box p={4}>
                <Typography variant="h4" align="center" fontWeight={600} mb={4}>
                    Estadísticas Generales
                </Typography>

                <Grid container spacing={3} mb={4}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item}>
                            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} md={6} lg={4} key={item}>
                            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <IconButton color="inherit" size="small" onClick={refetch}>
                            <RefreshIcon />
                        </IconButton>
                    }
                >
                    Error al cargar estadísticas: {error}
                </Alert>
            </Box>
        );
    }

    const chartConfigs = [
        {
            data: datos.porEstamento,
            title: 'Investigadores por Estamento',
            nameKey: 'nombre',
            type: 'pie'
        },
        {
            data: datos.porFacultad,
            title: 'Investigadores por Facultad',
            nameKey: 'nombre',
            type: 'pie'
        },
        {
            data: datos.porModulo,
            title: 'Investigadores por Módulo',
            nameKey: 'nombre',
            type: 'pie'
        },
        {
            data: datos.porTipo,
            title: 'Proyectos por Tipo',
            nameKey: 'nombre',
            type: 'bar'
        },
        {
            data: datos.porEstado,
            title: 'Proyectos por Estado',
            nameKey: 'nombre',
            type: 'bar'
        },
        {
            data: datos.porAnio,
            title: 'Proyectos por Año de Inicio',
            nameKey: 'nombre',
            type: 'bar'
        }
    ];

    return (
        <Fade in={true}>
            <Box p={4} bgcolor="#f8f9fa" minHeight="100vh">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        Estadísticas Generales
                    </Typography>
                    <IconButton
                        onClick={refetch}
                        color="primary"
                        sx={{
                            bgcolor: 'white',
                            boxShadow: 2,
                            '&:hover': { bgcolor: 'grey.100' }
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {datos.totales && (
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard
                                title="Total Investigadores"
                                value={datos.totales.total_investigadores}
                                icon={PeopleIcon}
                                color={GRADIENT_COLORS[0]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard
                                title="Total Proyectos"
                                value={datos.totales.total_proyectos}
                                icon={AssignmentIcon}
                                color={GRADIENT_COLORS[1]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard
                                title="Facultades"
                                value={datos.totales.total_facultades}
                                icon={SchoolIcon}
                                color={GRADIENT_COLORS[3]}
                            />
                        </Grid>
                    </Grid>
                )}

                <Grid container spacing={3} direction="column">
                    {chartConfigs.map((config, index) => (
                        <Grid item xs={12} key={index}>
                            {config.type === 'pie' ? (
                                <CustomPieChart
                                    data={config.data}
                                    title={config.title}
                                    dataKey="total"
                                    nameKey={config.nameKey}
                                />
                            ) : (
                                <CustomBarChart
                                    data={config.data}
                                    title={config.title}
                                    dataKey="total"
                                    nameKey={config.nameKey}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Fade>
    );
}

export default EstadisticasDashboard;