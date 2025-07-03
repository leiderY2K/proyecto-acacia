// src/services/apiPublic.js
import axios from 'axios';

const apiPublic = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiPublic;
