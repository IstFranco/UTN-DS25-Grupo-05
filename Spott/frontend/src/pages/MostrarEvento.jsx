import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import SongVoting from '../components/SongVoting';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';

export default function MostrarEvento() {
    const { state } = useLocation();
    const [usuarioInscrito, setUsuarioInscrito] = useState(false);
    const [usuarioData, setUsuarioData] = useState(null);
    const [esFavorito, setEsFavorito] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [estadisticasEvento, setEstadisticasEvento] = useState(null);

    if (!state?.evento) {
        return <p>No hay datos del evento.</p>;
    }

    const {
        id,
        imageSrc,
        title,
        description,
        rating,
        ciudad,
        barrio,
        tematica,
        musica,
        inscriptos,
        precio,
        imagenes = []
    } = state.evento;

    // Cargar estadísticas del evento al montar
    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/eventos/${id}/estadisticas`);
                if (res.ok) {
                    const data = await res.json();
                    setEstadisticasEvento(data);
                }
            } catch (err) {
                console.error('Error al cargar estadísticas:', err);
            }
        };

        cargarEstadisticas();
    }, [id]);

    // Verificar si el usuario ya está inscrito al cargar el componente
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("usuario") || "{}");
        setUsuarioData(userData);
        
        const usuarioId = userData.id;

        if (!usuarioId) {
            console.error("No se encontró ID de usuario");
            return;
        }

        fetch(`http://localhost:3001/api/eventos/check/${id}/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
            setUsuarioInscrito(data.inscrito);
        })
        .catch(err => console.error("Error al verificar inscripción:", err));

        // Verificar favorito
        fetch(`http://localhost:3001/api/favoritos/check/${id}/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
            setEsFavorito(data.esFavorito);
        })
        .catch(err => console.error("Error al verificar favorito:", err));
    }, [id]);

    const handleTicketSelection = async (tipoEntrada) => {
        try {
            const usuarioId = usuarioData?.id;

            if (!usuarioId) {
                alert("Error: No se encontró información del usuario. Inicia sesión nuevamente.");
                return;
            }

            const res = await fetch(`http://localhost:3001/api/eventos/${id}/inscribirse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId, tipoEntrada })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al inscribirse");
            }

            console.log("Inscripción realizada:", data);
            setUsuarioInscrito(true);
            setShowTicketModal(false);
            alert(`¡Te inscribiste al evento con entrada ${tipoEntrada.toUpperCase()}!`);
            
            // Recargar estadísticas después de la inscripción
            const statsRes = await fetch(`http://localhost:3001/api/eventos/${id}/estadisticas`);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setEstadisticasEvento(statsData);
            }
        } catch (err) {
            console.error(err);
            alert(`Error al inscribirse al evento: ${err.message}`);
        }
    };

    const desinscribirme = async () => {
        console.log('🔴 BOTÓN DESINSCRIBIRSE CLICKEADO');
        if (!window.confirm('¿Estás seguro de que deseas desinscribirte de este evento?')) {
            return;
        }
        
        try {
            const usuarioId = usuarioData?.id;

            if (!usuarioId) {
                alert("Error: No se encontró información del usuario. Inicia sesión nuevamente.");
                return;
            }

            const res = await fetch(`http://localhost:3001/api/eventos/${id}/usuario/${usuarioId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al desinscribirse");
            }

            const data = await res.json();
            console.log("Desinscripción realizada:", data);

            setUsuarioInscrito(false);
            alert("Te has desinscrito del evento exitosamente");
            
            // Recargar estadísticas después de la desinscripción
            const statsRes = await fetch(`http://localhost:3001/api/eventos/${id}/estadisticas`);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setEstadisticasEvento(statsData);
            }
        } catch (err) {
            console.error(err);
            alert(`Error al desinscribirse del evento: ${err.message}`);
        }
    };

    // Función para manejar favoritos
    const toggleFavorito = async () => {
        try {
            const usuarioId = usuarioData?.id;
            if (!usuarioId) {
                alert("Error: No se encontró información del usuario.");
                return;
            }

            if (esFavorito) {
                // Eliminar de favoritos
                const res = await fetch(`http://localhost:3001/api/favoritos/${id}/${usuarioId}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    setEsFavorito(false);
                    alert("Eliminado de favoritos");
                }
            } else {
                // Agregar a favoritos
                const res = await fetch(`http://localhost:3001/api/favoritos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventoId: id, usuarioId })
                });
                if (res.ok) {
                    setEsFavorito(true);
                    alert("Agregado a favoritos");
                }
            }
        } catch (err) {
            console.error("Error con favoritos:", err);
        }
    };

    return (
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />

            <div className="mostrar-evento">
                <div className="evento-card">
                    {/* Encabezado con logo y título */}
                    <div className="evento-header">
                        <img className="evento-logo" src={imageSrc} alt="Logo evento" />
                        <div className="evento-titulo-box">
                            <h2 className="evento-titulo">{title}</h2>
                            <p className="evento-inscriptos">{inscriptos} inscriptos</p>
                        </div>
                        <button 
                            onClick={toggleFavorito}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            {esFavorito ? '❤️' : '🤍'}
                        </button>
                    </div>

                    {/* Info del evento */}
                    <div className="evento-info">
                        <p className="evento-rating">⭐ {rating}</p>
                        <p className="evento-ubicacion">📍 {barrio}, {ciudad}</p>
                        <p className="evento-tematica">🎭 {tematica}</p>
                        <p className="evento-genero">🎵 {musica}</p>
                    </div>

                    {/* Disponibilidad de entradas */}
                    {estadisticasEvento && (
                        <div className="disponibilidad-entradas" style={{ 
                            background: '#f5f5f5', 
                            padding: '15px', 
                            borderRadius: '8px', 
                            margin: '15px 0' 
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Disponibilidad de Entradas</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <div>
                                    <strong>General:</strong> {estadisticasEvento.disponibles.disponiblesGeneral} / {estadisticasEvento.cupos.cupoGeneral} disponibles
                                </div>
                                <div>
                                    <strong>VIP:</strong> {estadisticasEvento.disponibles.disponiblesVip} / {estadisticasEvento.cupos.cupoVip} disponibles
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Descripción amplia */}
                    <div>
                        <h3>Descripción</h3>
                        <p>{description}</p>
                    </div>

                    {/* Galería de imágenes */}
                    <div className="evento-galeria">
                        <h3>Fotos del evento</h3>
                        <div className="galeria-scroll">
                            {imagenes.map((img, index) => (
                                <img key={index} src={img} alt={`foto-${index}`} className="galeria-img" />
                            ))}
                        </div>
                    </div>

                    {/* Botón de inscripción */}
                    <div className="evento-inscribirse">
                        {!usuarioInscrito ? (
                            <button 
                                className="btn-inscribirse" 
                                onClick={() => setShowTicketModal(true)}
                            >
                                Inscribirme al evento
                            </button>
                        ) : (
                            <div>
                                <div className="inscripcion-confirmada" style={{ marginBottom: '10px' }}>
                                    ✅ ¡Ya estás inscrito!
                                </div>
                                <button 
                                    className="btn-desinscribirse" 
                                    onClick={desinscribirme}
                                    style={{
                                        background: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        width: '100%'
                                    }}
                                >
                                    Desinscribirme del evento
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de selección de tipo de entrada */}
            {showTicketModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        maxWidth: '400px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>Selecciona tu tipo de entrada</h3>
                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                                Elige el tipo de entrada que prefieras para este evento
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {/* Entrada General */}
                            <div 
                                onClick={() => handleTicketSelection('general')}
                                style={{
                                    border: estadisticasEvento?.disponibles.disponiblesGeneral > 0 ? '2px solid #ddd' : '2px solid #ffcccb',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    cursor: estadisticasEvento?.disponibles.disponiblesGeneral > 0 ? 'pointer' : 'not-allowed',
                                    backgroundColor: estadisticasEvento?.disponibles.disponiblesGeneral > 0 ? 'white' : '#f5f5f5',
                                    opacity: estadisticasEvento?.disponibles.disponiblesGeneral > 0 ? 1 : 0.6,
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (estadisticasEvento?.disponibles.disponiblesGeneral > 0) {
                                        e.target.style.borderColor = '#007bff';
                                        e.target.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (estadisticasEvento?.disponibles.disponiblesGeneral > 0) {
                                        e.target.style.borderColor = '#ddd';
                                        e.target.style.backgroundColor = 'white';
                                    }
                                }}
                            >
                                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🎫 Entrada General</h4>
                                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                                    ${precio || 'Gratis'}
                                </p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                                    • Acceso completo al evento<br/>
                                    • Participación en votación de música<br/>
                                    • Zona general del venue
                                </p>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '12px', 
                                    color: estadisticasEvento?.disponibles.disponiblesGeneral > 0 ? '#28a745' : '#dc3545',
                                    fontWeight: 'bold'
                                }}>
                                    {estadisticasEvento?.disponibles.disponiblesGeneral > 0 
                                        ? `${estadisticasEvento.disponibles.disponiblesGeneral} entradas disponibles`
                                        : 'Sin disponibilidad'
                                    }
                                </p>
                            </div>

                            {/* Entrada VIP */}
                            <div 
                                onClick={() => handleTicketSelection('vip')}
                                style={{
                                    border: estadisticasEvento?.disponibles.disponiblesVip > 0 ? '2px solid #ffd700' : '2px solid #ffcccb',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    cursor: estadisticasEvento?.disponibles.disponiblesVip > 0 ? 'pointer' : 'not-allowed',
                                    backgroundColor: estadisticasEvento?.disponibles.disponiblesVip > 0 ? '#fffef7' : '#f5f5f5',
                                    opacity: estadisticasEvento?.disponibles.disponiblesVip > 0 ? 1 : 0.6,
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (estadisticasEvento?.disponibles.disponiblesVip > 0) {
                                        e.target.style.borderColor = '#ffb700';
                                        e.target.style.backgroundColor = '#fffbf0';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (estadisticasEvento?.disponibles.disponiblesVip > 0) {
                                        e.target.style.borderColor = '#ffd700';
                                        e.target.style.backgroundColor = '#fffef7';
                                    }
                                }}
                            >
                                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>👑 Entrada VIP</h4>
                                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                                    ${(precio ? precio * 1.5 : 50).toFixed(0)}
                                </p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                                    • Todo lo de entrada general<br/>
                                    • Área VIP exclusiva<br/>
                                    • Bebida de bienvenida<br/>
                                    • Acceso prioritario
                                </p>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '12px', 
                                    color: estadisticasEvento?.disponibles.disponiblesVip > 0 ? '#28a745' : '#dc3545',
                                    fontWeight: 'bold'
                                }}>
                                    {estadisticasEvento?.disponibles.disponiblesVip > 0 
                                        ? `${estadisticasEvento.disponibles.disponiblesVip} entradas disponibles`
                                        : 'Sin disponibilidad'
                                    }
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowTicketModal(false)}
                            style={{
                                marginTop: '20px',
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Componente de votación de canciones */}
            <SongVoting 
                eventoId={id} 
                usuarioInscrito={usuarioInscrito} 
                userId={usuarioData?.id}
                generoEvento={musica} 
            />

            <FooterUsuario />
        </div>
    );
}