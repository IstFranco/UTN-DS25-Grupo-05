import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';

export default function UsuarioNotificaciones() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />

            <div className="max-w-3xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-white mb-4">Notificaciones</h2>

                <div className="space-y-3">
                    {/* Lista de Notificaciones */}
                    {[...Array(6)].map((_, index) => (
                        <div 
                            key={index}
                            className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-4 hover:bg-purple-800/30 transition"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">🔔</span>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold mb-1">Recordatorio</h3>
                                    <p className="text-slate-300 text-sm mb-1">Evento mañana a las 20:00</p>
                                    <small className="text-slate-400 text-xs">Hace 1 día</small>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Notificaciones específicas */}
                    <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-4 hover:bg-purple-800/30 transition">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl">🎵</span>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">Nuevo evento musical</h3>
                                <p className="text-slate-300 text-sm mb-1">Concierto este fin de semana</p>
                                <small className="text-slate-400 text-xs">Hace 2 horas</small>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-4 hover:bg-purple-800/30 transition">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl">👍</span>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">Evento confirmado</h3>
                                <p className="text-slate-300 text-sm mb-1">Tu asistencia ha sido registrada</p>
                                <small className="text-slate-400 text-xs">Ayer</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterUsuario />
        </div>
    );
}