import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import SongVoting from '../components/SongVoting';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';

export default function EditarEvento() {
    const { state } = useLocation();
    const [estadisticasEvento, setEstadisticasEvento] = useState(null);

    if (!state?.evento) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <p className="text-slate-300">No hay datos del evento.</p>
            </div>
        );
    }

    const {
        id,
        imageSrc,
        title,
        description,
        fecha,
        horaInicio,
        rating,
        ciudad,
        barrio,
        tematica,
        estilo,
        musica,
        inscriptos,
        precio,
        precioVip,
        accesible,
        politicaCancelacion,
        linkExterno,
        hashtag,
        imagenes = []
    } = state.evento;

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_TM_API}/api/eventos/${id}/estadisticas`);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Editar Evento"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-2xl">
                    
                    {/* Header con imagen, título */}
                    <div className="flex items-start gap-4 mb-6">
                        <img 
                            src={imageSrc}
                            alt="Logo evento" 
                            className="w-32 h-32 rounded-lg object-cover border-2 border-purple-600/50 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                            <p className="text-slate-400 text-sm mb-3">{inscriptos} inscriptos</p>
                            
                            {/* Descripción aquí */}
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{description}</p>
                        </div>
                    </div>

                    {/* Info del evento */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Fecha</p>
                            <p className="text-white font-semibold">
                                📅 {fecha.split('T')[0]}, {horaInicio}
                            </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Ubicación</p>
                            <p className="text-white font-semibold">📍 {barrio}, {ciudad}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Temática</p>
                            <p className="text-white font-semibold">🎭 {tematica}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Estilo</p>
                            <p className="text-white font-semibold">🤓 {estilo}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Música</p>
                            <p className="text-white font-semibold">🎵 {musica}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Rating</p>
                            <p className="text-white font-semibold">⭐ {rating}</p>
                        </div>
                    </div>

                    {/* Disponibilidad de entradas */}
                    {estadisticasEvento && (
                        <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                            <h3 className="text-white font-bold mb-3">Disponibilidad de Entradas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-sm">General ${precio}</p>
                                    <p className="text-white font-semibold">
                                        {estadisticasEvento.disponibles.disponiblesGeneral} / {estadisticasEvento.cupos.cupoGeneral} disponibles 
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">VIP ${precioVip}</p>
                                    <p className="text-white font-semibold">
                                        {estadisticasEvento.disponibles.disponiblesVip} / {estadisticasEvento.cupos.cupoVip} disponibles 
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Galería de fotos extra */}
                    {imagenes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-white font-bold mb-3 text-sm">Galería del evento</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {imagenes.map((img, index) => (
                                    <img 
                                        key={index} 
                                        src={img}
                                        alt={`foto-${index}`} 
                                        className="h-32 w-32 rounded-lg object-cover border-2 border-purple-600/50 flex-shrink-0"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Accesible</p>
                            <p className="text-white font-semibold">
                                {accesible ? (<p>✅ Evento Accesible</p>): (<p>❌ Evento No Accesible</p>)}
                            </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Políticas de Cancelación</p>
                            <p className="text-white font-semibold">❌ {politicaCancelacion}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Links de Interés</p>
                            <p className="text-white font-semibold">📌 {linkExterno}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Hashtag</p>
                            <p className="text-white font-semibold">😎 {hashtag}</p>
                        </div>
                    </div>

                    {/* Sección de Canciones - Componente SongVoting */}
                    <SongVoting 
                        eventoId={id} 
                        usuarioInscrito={true}
                        userId={null}
                        generoEvento={musica}
                        userRole="empresa"
                    />
                </div>
            </div>

            <FooterEmpresa />
        </div>
    );
}