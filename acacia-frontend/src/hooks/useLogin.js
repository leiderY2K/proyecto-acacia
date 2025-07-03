// src/hooks/useLogin.js
import { useState } from 'react';
import { authService } from '../services/authService';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login({ email, password });

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, user: data.user };
        } catch (err) {
            setError(err.message || 'Error de autenticación');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};
