// src/hooks/useProyectos.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { proyectosService } from '../services/ProyectosService';

export const useProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Ref para evitar multiple llamadas simultáneas
    const isFetchingRef = useRef(false);
    const hasFetchedRef = useRef(false);

    // Función para obtener proyectos
    const fetchProyectos = useCallback(async (force = false) => {
        // Evitar múltiples peticiones simultáneas
        if (isFetchingRef.current && !force) {
            console.log('Ya hay una petición en curso, saltando...');
            return;
        }

        // Si ya se hizo fetch y no es forzado, no hacer nada
        if (hasFetchedRef.current && !force) {
            console.log('Ya se obtuvieron los datos, saltando...');
            return;
        }

        isFetchingRef.current = true;
        
        try {
            console.log('🚀 Iniciando petición de proyectos...');
            setLoading(true);
            setError(null);
            
            const response = await proyectosService.getAllProyectos();
            
            console.log('✅ Respuesta recibida:', response);
            
            // Verificar la estructura de la respuesta
            if (response && response.data && Array.isArray(response.data)) {
                setProyectos(response.data);
                console.log(`📊 ${response.data.length} proyectos cargados`);
            } else if (Array.isArray(response)) {
                setProyectos(response);
                console.log(`📊 ${response.length} proyectos cargados`);
            } else {
                console.error('❌ Estructura de respuesta inesperada:', response);
                setProyectos([]);
                setError('Formato de datos incorrecto');
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
    }, []); // Sin dependencias para evitar re-creaciones

    // useEffect que se ejecuta solo una vez
    useEffect(() => {
        console.log('🔄 useEffect ejecutándose...');
        
        // Solo ejecutar si no se ha hecho fetch antes
        if (!hasFetchedRef.current) {
            fetchProyectos();
        }
        
        // Cleanup function
        return () => {
            console.log('🧹 Limpiando useProyectos...');
        };
    }, [fetchProyectos]); // Array vacío = solo se ejecuta una vez

    // Función para refrescar datos
    const refetch = useCallback(() => {
        console.log('🔄 Refetch solicitado...');
        hasFetchedRef.current = false; // Permitir nuevo fetch
        fetchProyectos(true); // Forzar nuevo fetch
    }, [fetchProyectos]);

    // Función para limpiar el estado
    const reset = useCallback(() => {
        console.log('🔄 Reset solicitado...');
        setProyectos([]);
        setLoading(false);
        setError(null);
        hasFetchedRef.current = false;
        isFetchingRef.current = false;
    }, []);

    // Log de estado actual para debug
    useEffect(() => {
        console.log('📈 Estado actual:', {
            proyectosCount: proyectos.length,
            loading,
            error,
            hasFetched: hasFetchedRef.current,
            isFetching: isFetchingRef.current
        });
    }, [proyectos.length, loading, error]);

    return {
        proyectos,
        loading,
        error,
        refetch,
        reset
    };
};