// src/hooks/useProyectos.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { proyectosService } from '../services/ProyectosService';

export const useProyectos = (moduloId = null) => {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFetchingRef = useRef(false);
    const hasFetchedRef = useRef(false);

    const fetchProyectos = useCallback(async (force = false) => {
        if (isFetchingRef.current && !force) return;
        if (hasFetchedRef.current && !force) return;

        isFetchingRef.current = true;
        try {
            setLoading(true);
            setError(null);
            let response;

            if (moduloId) {
                console.log(`🔎 Filtrando por módulo: ${moduloId}`);
                response = await proyectosService.getProyectosPorModulo(moduloId);
            } else {
                response = await proyectosService.getAllProyectos();
            }

            console.log('📋 Respuesta completa:', response);

            // Extraer los proyectos según la estructura real de la API
            let proyectosData = [];
            
            if (response?.success && response?.data?.original?.success) {
                // Estructura: response.data.original.proyectos
                proyectosData = response.data.original.proyectos;
                console.log('✅ Proyectos extraídos de response.data.original.proyectos:', proyectosData);
            } else if (response?.data && Array.isArray(response.data)) {
                // Estructura directa: response.data
                proyectosData = response.data;
                console.log('✅ Proyectos extraídos de response.data:', proyectosData);
            } else if (Array.isArray(response)) {
                // Estructura directa: response
                proyectosData = response;
                console.log('✅ Proyectos extraídos directamente:', proyectosData);
            } else {
                console.warn('⚠️ Estructura de datos no reconocida:', response);
                proyectosData = [];
            }

            if (Array.isArray(proyectosData)) {
                setProyectos(proyectosData);
                console.log(`✅ Se cargaron ${proyectosData.length} proyectos`);
            } else {
                setProyectos([]);
                setError('Formato de datos incorrecto: no se encontró un array de proyectos');
            }

            hasFetchedRef.current = true;
        } catch (err) {
            console.error('❌ Error al obtener proyectos:', err);
            setError(err.message || 'Error al cargar los proyectos');
            setProyectos([]);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [moduloId]);

    useEffect(() => {
        fetchProyectos();
    }, [fetchProyectos]);

    const refetch = useCallback(() => {
        hasFetchedRef.current = false;
        fetchProyectos(true);
    }, [fetchProyectos]);

    const reset = useCallback(() => {
        setProyectos([]);
        setLoading(false);
        setError(null);
        hasFetchedRef.current = false;
        isFetchingRef.current = false;
    }, []);

    return {
        proyectos,
        loading,
        error,
        refetch,
        reset
    };
};