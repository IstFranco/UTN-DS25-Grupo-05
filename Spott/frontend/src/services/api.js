// services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la petición');
            }
            return await response.json();
        } catch (error) {
            console.error('Error en API request:', error);
            throw error;
        }
    }

    async requestFormData(endpoint, formData, method = 'POST') {
        const url = `${API_BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method,
                body: formData, // FormData se envía sin Content-Type header
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la petición');
            }
            return await response.json();
        } catch (error) {
            console.error('Error en API FormData request:', error);
            throw error;
        }
    }

    // Métodos para eventos
    async obtenerEventos(filtros = {}) {
        const params = new URLSearchParams(filtros);
        return this.request(`/eventos?${params}`);
    }

    async obtenerEventoPorId(id) {
        return this.request(`/eventos/${id}`);
    }

    async crearEvento(formData) {
        return this.requestFormData('/eventos', formData);
    }

    async actualizarEvento(id, formData) {
        return this.requestFormData(`/eventos/${id}`, formData, 'PUT');
    }

    async eliminarEvento(id) {
        return this.request(`/eventos/${id}`, { method: 'DELETE' });
    }

    async obtenerEventosPorEmpresa(empresaId) {
        return this.request(`/eventos/empresa/${empresaId}`);
    }

    async inscribirseEvento(eventoId, usuarioId, tipoEntrada = 'general') {
        return this.request(`/eventos/${eventoId}/inscribirse`, {
            method: 'POST',
            body: JSON.stringify({ usuarioId, tipoEntrada }),
        });
    }

    async desinscribirseEvento(eventoId, usuarioId) {
        return this.request(`/eventos/${eventoId}/desinscribirse`, {
            method: 'DELETE',
            body: JSON.stringify({ usuarioId }),
        });
    }

    async obtenerEventosInscritos(usuarioId) {
        return this.request(`/eventos/usuario/${usuarioId}/inscritos`);
    }
}

export default new ApiService();