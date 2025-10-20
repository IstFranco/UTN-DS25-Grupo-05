import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import SongVoting from '../components/SongVoting';
import { useAuth } from '../contexts/AuthContext';

export default function EventoInscripto() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

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
        rating,
        ciudad,
        barrio,
        tematica,
        musica
    } = state.evento;

    const desinscribirme = async () => {
        if (!window.confirm('¿Estás seguro de que deseas desinscribirte de este evento?')) {
            return;
        }
        try {
            if (!user?.userId) {
                alert("Error: No se encontró información del usuario. Inicia sesión nuevamente.");
                return;
            }
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_TM_API}/api/eventos/${id}/usuario/${user.userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al desinscribirse");
            }
            alert("Te has desinscrito del evento exitosamente");
            navigate('/usuario');
        } catch (err) {
            console.error(err);
            alert(`Error al desinscribirse del evento: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <img 
                            src={imageSrc} 
                            alt="Logo evento" 
                            className="w-24 h-24 rounded-lg object-cover border-2 border-purple-600/50"
                        />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                            <div className="bg-green-600/20 border border-green-500/50 text-green-200 px-3 py-1 rounded-lg text-sm font-semibold inline-block mt-2">
                                ✅ Estás inscrito
                            </div>
                        </div>
                    </div>

                    {/* Info del evento */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <p className="text-slate-400 text-sm">Rating</p>
                            <p className="text-white font-semibold">⭐ {rating}</p>
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
                            <p className="text-slate-400 text-sm">Música</p>
                            <p className="text-white font-semibold">🎵 {musica}</p>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mb-6">
                        <h3 className="text-white font-bold mb-2">Descripción</h3>
                        <p className="text-slate-300">{description}</p>
                    </div>

                    {/* Botón desinscribirse */}
                    <button
                        onClick={desinscribirme}
                        disabled={loading}
                        className="w-full bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Procesando..." : "Desinscribirme del evento"}
                    </button>
                </div>
            </div>

            {/* Votación de canciones */}
            <SongVoting
                eventoId={id}
                usuarioInscrito={state?.usuarioInscrito ?? true}
                userId={user?.userId}
                generoEvento={musica}
            />

            <FooterUsuario />
        </div>
    );
}