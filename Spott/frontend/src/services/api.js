// frontend/src/services/api.js
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
class ApiService {
    // Helper para obtener headers con o sin token
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Helper para manejar respuestas y errores
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            // Si es 401 (no autorizado), limpiar datos y redirigir
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                localStorage.removeItem('empresa');
                window.location.href = '/iniciar-sesion/usuario';
            }
            throw new Error(data.message || 'Error en la petición');
        }

        return data;
    }

    // Método genérico para peticiones JSON
    async request(endpoint, options = {}, includeAuth = false) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(includeAuth),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error en API request:', error);
            throw error;
        }
    }

    // Método para peticiones con FormData
    async requestFormData(endpoint, formData, method = 'POST', includeAuth = true) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Para FormData, solo incluimos Authorization si es necesario
        const headers = {};
        if (includeAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: formData,
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error en API FormData request:', error);
            throw error;
        }
    }

    // MÉTODOS PÚBLICOS sin token

    async obtenerEventos(filtros = {}) {
        const params = new URLSearchParams(filtros);
        return this.request(`/eventos?${params}`, {}, false); // false = público
    }

    async obtenerEventoPorId(id) {
        return this.request(`/eventos/${id}`, {}, false); // público
    }

    // MÉTODOS PRIVADOS (con token)

    async crearEvento(formData) {
        return this.requestFormData('/eventos', formData, 'POST', true); // true = privado
    }

    async actualizarEvento(id, formData) {
        return this.requestFormData(`/eventos/${id}`, formData, 'PUT', true);
    }

    async eliminarEvento(id) {
        return this.request(`/eventos/${id}`, { method: 'DELETE' }, true);
    }

    async obtenerEventosPorEmpresa(empresaId) {
        return this.request(`/eventos/empresa/${empresaId}`, {}, true);
    }

    async inscribirseEvento(eventoId, usuarioId, tipoEntrada = 'general') {
        return this.request(`/eventos/${eventoId}/inscribirse`, {
            method: 'POST',
            body: JSON.stringify({ usuarioId, tipoEntrada }),
        }, true);
    }

    async desinscribirseEvento(eventoId, usuarioId) {
        return this.request(`/eventos/${eventoId}/desinscribirse`, {
            method: 'DELETE',
            body: JSON.stringify({ usuarioId }),
        }, true);
    }

    async obtenerEventosInscritos(usuarioId) {
        return this.request(`/eventos/usuario/${usuarioId}/inscritos`, {}, true);
    }

    // MÉTODOS DE FAVORITOS (privados)

    async agregarFavorito(eventoId, usuarioId) {
        return this.request(`/favoritos`, {
            method: 'POST',
            body: JSON.stringify({ eventoId, usuarioId }),
        }, true);
    }

    async eliminarFavorito(eventoId, usuarioId) {
        return this.request(`/favoritos`, {
            method: 'DELETE',
            body: JSON.stringify({ eventoId, usuarioId }),
        }, true);
    }

    async obtenerFavoritos(usuarioId) {
        return this.request(`/favoritos/${usuarioId}`, {}, true);
    }

    // MÉTODOS DE VOTOS (privados)

    async votarCancion(cancionId, usuarioId, tipo) {
        return this.request(`/votos`, {
            method: 'POST',
            body: JSON.stringify({ cancionId, usuarioId, tipo }),
        }, true);
    }
}

// Exportar una instancia única
export default new ApiService();