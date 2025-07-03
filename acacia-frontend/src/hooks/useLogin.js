// src/hooks/useLogin.js
import { useState } from 'react';
import { authService } from '../services/authService';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.login({ email, password });
            setToken(result.token);

            // Guardar token en localStorage para futuras peticiones
            localStorage.setItem('auth_token', result.token);

            return { success: true, user: result.user };
        } catch (err) {
            setError('Credenciales inválidas o error del servidor');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading,
        error,
        token
    };
};
