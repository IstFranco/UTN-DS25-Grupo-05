import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';

export default function EmpresaPerfil() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            <div className="max-w-md mx-auto px-4 py-8">
                <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-8 shadow-2xl">
                    {/* Foto y datos del perfil */}
                    <div className="text-center mb-8">
                        <img 
                            src={perfilImg} 
                            alt="Foto de perfil" 
                            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-600/50 object-cover"
                        />
                        <h2 className="text-2xl font-bold text-white mb-1">Empresa Spott</h2>
                        <p className="text-slate-400">empresa@spott.com</p>
                    </div>

                    {/* Botones de opciones */}
                    <div className="space-y-3">
                        <button className="w-full bg-slate-900/50 border border-purple-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition flex items-center gap-3">
                            <span className="text-2xl">⚙️</span>
                            <span className="text-white font-medium">Configuración</span>
                        </button>

                        <button className="w-full bg-slate-900/50 border border-purple-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition flex items-center gap-3">
                            <span className="text-2xl">🔒</span>
                            <span className="text-white font-medium">Privacidad</span>
                        </button>

                        <button className="w-full bg-slate-900/50 border border-purple-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition flex items-center gap-3">
                            <span className="text-2xl">❓</span>
                            <span className="text-white font-medium">Ayuda</span>
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-red-600/20 border border-red-500/50 rounded-lg p-4 hover:bg-red-600/30 transition flex items-center gap-3"
                        >
                            <span className="text-2xl">🚪</span>
                            <span className="text-white font-medium">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </div>

            <FooterEmpresa />
        </div>
    );
}