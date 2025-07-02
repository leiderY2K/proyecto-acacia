// src/hooks/useInvestigadores.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { investigadoresService } from '../services/InvestigadoresService';
export const useInvestigadores = () => {
    const [investigadores, setInvestigadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Ref para evitar multiple llamadas simultáneas
    const isFetchingRef = useRef(false);
    const hasFetchedRef = useRef(false);

    // Función para obtener investigadores
    const fetchInvestigadores = useCallback(async (force = false) => {
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
            console.log('🚀 Iniciando petición de investigadores...');
            setLoading(true);
            setError(null);
            
            const response = await investigadoresService.getAllInvestigadores();
            
            console.log('✅ Respuesta recibida:', response);
            
            // Verificar la estructura de la respuesta
            if (response && response.data && Array.isArray(response.data)) {
                setInvestigadores(response.data);
                console.log(`📊 ${response.data.length} investigadores cargados`);
            } else if (Array.isArray(response)) {
                setInvestigadores(response);
                console.log(`📊 ${response.length} investigadores cargados`);
            } else {
                console.error('❌ Estructura de respuesta inesperada:', response);
                setInvestigadores([]);
                setError('Formato de datos incorrecto');
            }
            
            hasFetchedRef.current = true;
            
        } catch (err) {
            console.error('❌ Error al obtener investigadores:', err);
            setError(err.message || 'Error al cargar los investigadores');
            setInvestigadores([]);
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
            fetchInvestigadores();
        }
        
        // Cleanup function
        return () => {
            console.log('🧹 Limpiando useInvestigadores...');
        };
    }, []);

    // Función para refrescar datos
    const refetch = useCallback(() => {
        console.log('🔄 Refetch solicitado...');
        hasFetchedRef.current = false; // Permitir nuevo fetch
        fetchInvestigadores(true); // Forzar nuevo fetch
    }, [fetchInvestigadores]);

    // Función para limpiar el estado
    const reset = useCallback(() => {
        console.log('🔄 Reset solicitado...');
        setInvestigadores([]);
        setLoading(false);
        setError(null);
        hasFetchedRef.current = false;
        isFetchingRef.current = false;
    }, []);

    // Log de estado actual para debug
    useEffect(() => {
        console.log('📈 Estado actual:', {
            investigadoresCount: investigadores.length,
            loading,
            error,
            hasFetched: hasFetchedRef.current,
            isFetching: isFetchingRef.current
        });
    }, [investigadores.length, loading, error]);

    return {
        investigadores,
        loading,
        error,
        refetch,
        reset
    };
};