import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import FooterEmpresa from '../components/FooterEmpresa';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import ApiService from '../services/api';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import { useAuth } from '../contexts/AuthContext';
import '../app.css';

export default function MisEventos() {
    const [eventosInscritos, setEventosInscritos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtros, setFiltros] = useState({});
    const navigate = useNavigate();

    // 👇 ahora usamos AuthContext
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
                // fallback local (solo si quisieras mantenerlo)
                const clave = rol === 'empresa' ? 'misEventos' : 'eventosUsuario';
                const guardados = JSON.parse(localStorage.getItem(clave)) || [];
                setEventosInscritos(guardados);
            } finally {
                setCargando(false);
            }
        };

        if (user) { // 👈 solo carga si ya hay usuario logueado
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

    const handleEliminarEvento = async (eventoId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
        try {
            await ApiService.eliminarEvento(eventoId);
            setEventosInscritos(prev => prev.filter(evento => evento.id !== eventoId));
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            setError('Error al eliminar el evento');
        }
    };

    const handleDesinscribirse = async (eventoId) => {
        if (!window.confirm('¿Estás seguro de que deseas desinscribirte de este evento?')) return;
        try {
            const usuarioId = user?.userId;
            if (!usuarioId) {
                setError('No se encontró información del usuario');
                return;
            }

            const res = await fetch(`http://localhost:3000/api/eventos/${eventoId}/usuario/${usuarioId}`, {
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
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: `/${rol}/perfil` }}
                rightButton={{ type: 'image', content: notiImg, to: `/${rol}/notificaciones` }}
            />

            <div className='inicio'>
                {error && (
                    <div style={{ backgroundColor: '#ff4444', color: 'white', padding: '10px', margin: '10px', borderRadius: '5px' }}>
                        {error}
                    </div>
                )}

                {/* Barra de búsqueda y filtros */}
                <FiltrosBusqueda 
                    busqueda={busqueda} 
                    setBusqueda={setBusqueda} 
                    onAplicarFiltros={setFiltros} 
                />

                {/* Mis eventos */}
                <div className='misEventos'>
                    <h2 className="section-title">
                        {esEmpresa ? 'Mis eventos creados' : 'Eventos inscritos'}
                    </h2>
                    
                    {cargando && <p style={{ color: 'white', textAlign: 'center' }}>Cargando eventos...</p>}
                    
                    {!cargando && eventosFiltrados.length === 0 ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>
                            {esEmpresa ? 'No has creado eventos aún.' : 'No estás inscrito en ningún evento.'}
                        </p>
                    ) : (
                        eventosFiltrados.map((evento, i) => (
                            <div
                                key={evento.id || `evento-${i}`}
                                className="evento-item"
                                style={{ position: 'relative' }}
                            >
                                <div 
                                    onClick={() => handleEventoClick(evento)}
                                    style={{ cursor: 'pointer', display: 'flex', width: '100%' }}
                                >
                                    <div className="evento-imagen">
                                        <img 
                                            src={evento.imageSrc || evento.portada || '/placeholder-image.jpg'} 
                                            alt={evento.title || evento.nombre} 
                                            onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                        />
                                    </div>
                                    <div className="evento-info">
                                        <div>
                                            <h3 className="evento-titulo">{evento.title || evento.nombre}</h3>
                                            <p className="evento-musica">
                                                {evento.musica} 
                                                {evento.fecha && ` • ${new Date(evento.fecha).toLocaleDateString()}`}
                                                {evento.ciudad && ` • ${evento.ciudad}`}
                                            </p>
                                            <p className="evento-descripcion">
                                                {evento.description || evento.descripcionLarga || 'Sin descripción'}
                                            </p>
                                        </div>
                                        <div className="evento-rating">⭐ {evento.rating}</div>
                                    </div>
                                </div>
                                
                                {/* Botones de acción */}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                                    {esEmpresa ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEliminarEvento(evento.id); }}
                                            style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Eliminar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDesinscribirse(evento.id); }}
                                            style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Desinscribirse
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {rol === 'empresa' ? <FooterEmpresa /> : <FooterUsuario />}
            </div>
        </div>
    );
}
