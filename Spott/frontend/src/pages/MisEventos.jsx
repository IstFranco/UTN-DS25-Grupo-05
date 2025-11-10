import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import FooterEmpresa from '../components/FooterEmpresa';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import PresentCard from '../components/PresentCard';
import ApiService from '../services/api';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import { useAuth } from '../contexts/AuthContext';

export default function MisEventos() {
    const [eventosInscritos, setEventosInscritos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtros, setFiltros] = useState({});
    const navigate = useNavigate();

    const { user, userType } = useAuth();
    const esEmpresa = userType === 'empresa';
    const rol = esEmpresa ? 'empresa' : 'usuario';

    useEffect(() => {
        const cargarEventos = async () => {
            setCargando(true);
            setError(null);

            try {
                let eventos = [];
                if (esEmpresa) {
                    const empresaId = user?.userId;
                    if (!empresaId) {
                        setError('No se encontró información de la empresa');
                        return;
                    }
                    const response = await ApiService.obtenerEventosPorEmpresa(empresaId);
                    eventos = response.eventos || [];
                } else {
                    const usuarioId = user?.userId;
                    if (!usuarioId) {
                        setError('No se encontró información del usuario');
                        return;
                    }
                    const response = await ApiService.obtenerEventosInscritos(usuarioId);
                    eventos = response.eventos || [];
                }
                setEventosInscritos(eventos);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
                setError('Error al cargar eventos');
                const clave = rol === 'empresa' ? 'misEventos' : 'eventosUsuario';
                const guardados = JSON.parse(localStorage.getItem(clave)) || [];
                setEventosInscritos(guardados);
            } finally {
                setCargando(false);
            }
        };

        if (user) {
            cargarEventos();
        }
    }, [rol, esEmpresa, filtros, user]);

    const eventosFiltrados = eventosInscritos.filter(evento =>
        evento.title?.toLowerCase().includes(busqueda.toLowerCase()) ||
        evento.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleEventoClick = (evento) => {
        if (esEmpresa) {
            navigate('/empresa/editar-evento', { state: { evento } });
        } else {
            navigate('/evento-inscripto', { 
                state: { 
                    evento, 
                    usuarioInscrito: true, 
                    userId: user?.userId 
                } 
            });
        }
    };

    const handleEliminarEvento = async (eventoId, e) => {
        e.stopPropagation();
        if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
        try {
            await ApiService.eliminarEvento(eventoId);
            setEventosInscritos(prev => prev.filter(evento => evento.id !== eventoId));
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            setError('Error al eliminar el evento');
        }
    };

    const handleDesinscribirse = async (eventoId, e) => {
        e.stopPropagation();
        if (!window.confirm('¿Estás seguro de que deseas desinscribirte de este evento?')) return;
        try {
            const usuarioId = user?.userId;
            if (!usuarioId) {
                setError('No se encontró información del usuario');
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_TM_API}/api/eventos/${eventoId}/usuario/${usuarioId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al desinscribirse");
            }
            
            setEventosInscritos(prev => prev.filter(evento => evento.id !== eventoId));
        } catch (error) {
            console.error('Error al desinscribirse:', error);
            setError('Error al desinscribirse del evento');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: `/${rol}/perfil` }}
                rightButton={{ type: 'image', content: notiImg, to: `/${rol}/notificaciones` }}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center mb-4">
                        {error}
                    </div>
                )}

                <FiltrosBusqueda 
                    busqueda={busqueda} 
                    setBusqueda={setBusqueda} 
                    onAplicarFiltros={setFiltros} 
                />

                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {esEmpresa ? 'Mis eventos' : 'Eventos inscritos'}
                    </h2>
                    
                    {cargando && (
                        <div className="text-center py-12">
                            <p className="text-slate-300">Cargando eventos...</p>
                        </div>
                    )}
                    
                    {!cargando && eventosFiltrados.length === 0 && (
                        <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-8 text-center">
                            <p className="text-slate-300">
                                {esEmpresa ? 'No has creado eventos aún.' : 'No estás inscrito en ningún evento.'}
                            </p>
                        </div>
                    )}
                    
                    {!cargando && eventosFiltrados.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {eventosFiltrados.map((evento, i) => (
                                <div key={evento.id || `evento-${i}`} className="relative">
                                    <PresentCard
                                        imageSrc={evento.imageSrc || evento.portada}
                                        title={evento.title || evento.nombre}
                                        description={evento.description || evento.descripcionLarga || 'Sin descripción'}
                                        rating={evento.rating}
                                        onClick={() => handleEventoClick(evento)}
                                    />
                                    <button
                                        onClick={(e) => esEmpresa ? handleEliminarEvento(evento.id, e) : handleDesinscribirse(evento.id, e)}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-lg transition z-10"
                                    >
                                        {esEmpresa ? 'Eliminar' : 'Desinscribirse'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {rol === 'empresa' ? <FooterEmpresa /> : <FooterUsuario />}
        </div>
    );
}