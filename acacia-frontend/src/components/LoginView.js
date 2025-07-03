// src/components/LoginView.js
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Paper
} from '@mui/material';
import { useLogin } from '../hooks/useLogin';

function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useLogin();
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            setSuccessMessage(`Bienvenido ${result.user.name || result.user.email}`);
            // Aquí podrías redirigir, por ejemplo:
            // navigate('/dashboard');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                    Iniciar Sesión
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Correo"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                        </Button>
                    </Box>
                </form>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                )}
                {successMessage && (
                    <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>
                )}
            </Paper>
        </Box>
    );
}

export default LoginView;
