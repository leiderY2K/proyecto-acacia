import { useState, useEffect, useCallback } from 'react';
import estadisticasService from '../services/estadisticasService';

export const useEstadisticas = () => {
    const [datos, setDatos] = useState({
        totales: null,
        porEstamento: [],
        porFacultad: [],
        porModulo: [],
        porTipo: [],
        porEstado: [],
        porAnio: []
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarEstadisticas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const estadisticas = await estadisticasService.obtenerTodasLasEstadisticas();
            
            setDatos({
                totales: estadisticas.totales,
                porEstamento: estadisticas.porEstamento || [],
                porFacultad: estadisticas.porFacultad || [],
                porModulo: estadisticas.porModulo || [],
                porTipo: estadisticas.porTipo || [],
                porEstado: estadisticas.porEstado || [],
                porAnio: estadisticas.porAnio || []
            });
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
            setError(err.message || 'Error al cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = useCallback(() => {
        cargarEstadisticas();
    }, [cargarEstadisticas]);

    useEffect(() => {
        cargarEstadisticas();
    }, [cargarEstadisticas]);

    return {
        datos,
        loading,
        error,
        refetch
    };
};

// Hook específico para obtener estadísticas por rango de fechas
export const useEstadisticasPorRango = (desde, hasta) => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarDatos = useCallback(async () => {
        if (!desde || !hasta) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await estadisticasService.proyectosPorRangoInicio(desde, hasta);
            setDatos(response.data || []);
        } catch (err) {
            console.error('Error al cargar estadísticas por rango:', err);
            setError(err.message || 'Error al cargar las estadísticas por rango');
        } finally {
            setLoading(false);
        }
    }, [desde, hasta]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    return {
        datos,
        loading,
        error,
        refetch: cargarDatos
    };
};