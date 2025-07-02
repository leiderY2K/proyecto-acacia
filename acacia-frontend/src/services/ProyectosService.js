// src/services/ProyectosService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globalmente
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

export const proyectosService = {
    // Obtener todos los proyectos
    getAllProyectos: async () => {
        try {
            console.log('Service: Obteniendo todos los proyectos...'); // Debug log
            const response = await api.get('/api/proyectos');
            console.log('Service: Respuesta recibida:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Service: Error al obtener proyectos:', error);
            throw error;
        }
    },

    // Obtener un proyecto por ID
    getProyectoById: async (id) => {
        try {
            const response = await api.get(`/api/proyectos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Service: Error al obtener proyecto ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo proyecto
    createProyecto: async (proyectoData) => {
        try {
            const response = await api.post('/api/proyectos', proyectoData);
            return response.data;
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            throw error; // Propagar el error para manejo en el componente
        }
    },

    // Actualizar un proyecto
    updateProyecto: async (id, proyectoData) => {
        try {
            const response = await api.put(`/api/proyectos/${id}`, proyectoData);
            return response.data;
        } catch (error) {
            console.error(`Service: Error al actualizar proyecto ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un proyecto
    deleteProyecto: async (id) => {
        try {
            const response = await api.delete(`/api/proyectos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Service: Error al eliminar proyecto ${id}:`, error);
            throw error;
        }
    },

    // Buscar proyectos por término
    searchProyectos: async (searchTerm) => {
        try {
            const response = await api.get(`/api/proyectos/search?q=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            console.error('Service: Error al buscar proyectos:', error);
            throw error;
        }
    }
};

export { api };