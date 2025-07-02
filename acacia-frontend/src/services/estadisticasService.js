import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class EstadisticasService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Interceptor para manejar errores globalmente
        this.api.interceptors.response.use(
            response => response,
            error => {
                console.error('Error en EstadisticasService:', error);
                return Promise.reject(this.handleError(error));
            }
        );
    }

    handleError(error) {
        if (error.response) {
            // Error del servidor
            return {
                message: error.response.data?.message || 'Error del servidor',
                status: error.response.status,
                data: error.response.data
            };
        } else if (error.request) {
            // Error de red
            return {
                message: 'Error de conexión. Verifique su conexión a internet.',
                status: 0
            };
        } else {
            // Error de configuración
            return {
                message: error.message || 'Error desconocido',
                status: -1
            };
        }
    }

    async totales() {
        try {
            const response = await this.api.get('/api/estadisticas/totales');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async investigadoresPorEstamento() {
        try {
            const response = await this.api.get('/api/estadisticas/investigadores-por-estamento');
            return response.data.map(item => ({
                nombre: item.nombre,
                total: item.total
            }));
        } catch (error) {
            throw error;
        }
    }

    async investigadoresPorFacultad() {
        try {
            const response = await this.api.get('/api/estadisticas/investigadores-por-facultad');
            return response.data.map(item => ({
                nombre: item.nombre,
                total: item.total
            }));
        } catch (error) {
            throw error;
        }
    }

    async investigadoresPorModulo() {
        try {
            const response = await this.api.get('/api/estadisticas/investigadores-por-modulo');
            return response.data.map(item => ({
                nombre: item.nombre_modulo,
                total: item.investigadores_count
            }));
        } catch (error) {
            throw error;
        }
    }

    async proyectosPorTipo() {
        try {
            const response = await this.api.get('/api/estadisticas/proyectos-por-tipo');
            return response.data.map(item => ({
                nombre: item.nombre,
                total: item.total
            }));
        } catch (error) {
            throw error;
        }
    }

    async proyectosPorEstado() {
        try {
            const response = await this.api.get('/api/estadisticas/proyectos-por-estado');
            return response.data.map(item => ({
                nombre: item.nombre,
                total: item.total
            }));
        } catch (error) {
            throw error;
        }
    }

    async proyectosPorAnioInicio() {
        try {
            const response = await this.api.get('/api/estadisticas/proyectos-por-anio-inicio');
            const items = response.data?.data || [];
            return items.map(item => ({
                nombre: item.anio,
                total: item.total
            }));
        } catch (error) {
            throw error;
        }
    }


    async proyectosPorRangoInicio(desde, hasta) {
        try {
            const response = await this.api.get('/api/estadisticas/proyectos-por-rango-inicio', {
                params: { desde, hasta }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async obtenerTodasLasEstadisticas() {
        try {
            const [
                totales,
                porEstamento,
                porFacultad,
                porModulo,
                porTipo,
                porEstado,
                porAnio
            ] = await Promise.all([
                this.totales(),
                this.investigadoresPorEstamento(),
                this.investigadoresPorFacultad(),
                this.investigadoresPorModulo(),
                this.proyectosPorTipo(),
                this.proyectosPorEstado(),
                this.proyectosPorAnioInicio()
            ]);

            return {
                totales,
                porEstamento,
                porFacultad,
                porModulo,
                porTipo,
                porEstado,
                porAnio
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new EstadisticasService();