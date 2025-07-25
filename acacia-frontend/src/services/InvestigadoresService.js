// src/services/InvestigadoresService.js
//import axios from 'axios';
import api from './api'; // con token
import apiPublic from './apiPublic'; // sin token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);

        if (error.response) {
            // El servidor respondió con un código de error
            throw new Error(`Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            // La petición fue enviada pero no se recibió respuesta
            throw new Error('Error de conexión: No se pudo conectar con el servidor');
        } else {
            // Error en la configuración de la petición
            throw new Error(`Error de petición: ${error.message}`);
        }
    }
);

export const investigadoresService = {
    // Obtener todos los investigadores
    getAllInvestigadores: async () => {
        try {
            console.log('Service: Obteniendo todos los investigadores...'); // Debug log
            const response = await apiPublic.get('/investigadores');
            console.log('Service: Respuesta recibida:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Service: Error al obtener investigadores:', error);
            throw error;
        }
    },

    // Obtener un investigador por ID
    getInvestigadoresById: async (id) => {
        try {
            const response = await apiPublic.get(`/investigadores/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Service: Error al obtener investigadores ${id}:`, error);
            throw error;
        }
    },

    // Obtener investigadores por grupo y módulo
    getInvestigadoresGpModulo: async () => {
        try {
            const response = await apiPublic.get('/investigadores/gp-modulo');
            return response.data;
        } catch (error) {
            console.error('Service: Error al obtener investigadores por grupo y módulo:', error);
            throw error;
        }
    },
    // Crear un nuevo investigador
    createInvestigador: async (investigadorData) => {
        try {
            const response = await api.post('/investigadores', investigadorData);
            return response.data;
        } catch (error) {
            console.error('Service: Error al crear investigador:', error);
            throw error;
        }
    },

    // Actualizar un investigador
    updateInvestigadores: async (id, investigadorData) => {
        try {
            const response = await api.put(`/investigadores/${id}`, investigadorData);
            return response.data;
        } catch (error) {
            console.error(`Service: Error al actualizar investigador ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un investigador
    deleteInvestigador: async (id) => {
        try {
            const response = await api.delete(`/investigadores/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Service: Error al eliminar investigador ${id}:`, error);
            throw error;
        }
    },

    // Buscar investigador por término
    searchInvestigador: async (searchTerm) => {
        try {
            const response = await apiPublic.get(`/investigadores/search?q=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            console.error('Service: Error al buscar investigadores:', error);
            throw error;
        }
    }
};