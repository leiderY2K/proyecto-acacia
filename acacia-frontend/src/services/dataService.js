// src/services/dataService.js
//import { api } from './InvestigadoresService'; // Importa la instancia de axios desde InvestigadoresService
import apiPublic from './apiPublic'; // Importa la instancia de axios sin token
export const dataService = {

    getTiposProyecto: async () => {
        try {
            const response = await apiPublic.get(`/tipos-proyecto`);
            return response.data.data;
        }
        catch (error) {
            console.error('Error al obtener tipos-proyecto:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getEstados: async () => {
        try {
            const response = await apiPublic.get(`/estados`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener estados:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getInvestigadores: async () => {
        try {
            const response = await apiPublic.get(`/investigadores`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener investigadores:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    getFacultades: async () => {
        try {
            const response = await apiPublic.get('/facultades');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener facultades:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getEstamentos: async () => {
        try {
            const response = await apiPublic.get('/estamentos');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener estamentos:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getGrupos: async () => {
        try {
            const response = await apiPublic.get('/grupos');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener grupos:', error.response ? error.response.data : error.message);
            throw error;
        }
    },
    getModulos: async () => {
        try {
            const response = await apiPublic.get('/modulos');
            return response.data.data; // Extraer solo la propiedad 'data' del response
        } catch (error) {
            console.error('Error al obtener módulos:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
};