// src/services/dataService.js
import { api } from './InvestigadoresService'; // Importa la instancia de axios desde InvestigadoresService
import { api as proyectosApi } from './ProyectosService'; // Para tipos proyecto, estados, investigadores
export const dataService = {

    getTiposProyecto: async () => {
        try {
            const response = await proyectosApi.get(`/api/tipos-proyecto`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error al obtener tipos-proyecto:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getEstados: async () => {
        try {
            const response = await proyectosApi.get(`api/estados`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener estados:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getInvestigadores: async () => {
        try {
            const response = await proyectosApi.get(`api/investigadores`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener investigadores:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    getFacultades: async () => {
        try {
            const response = await api.get('/api/facultades');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener facultades:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getEstamentos: async () => {
        try {
            const response = await api.get('/api/estamentos');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener estamentos:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getGrupos: async () => {
        try {
            const response = await api.get('/api/grupos');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener grupos:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getModulos: async () => {
        try {
            const response = await api.get('/api/modulos');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener módulos:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
};