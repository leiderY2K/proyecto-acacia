// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Ajusta esto si usas proxy

export const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        return response.data;
    }
};
