import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';
import PresentCard from '../components/PresentCard';

export default function UsuarioFavoritos() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarFavoritos = async () => {
            try {
                if (!user || !user.userId) {
                    setError('No se encontró información del usuario');
                    setCargando(false);
                    return;
                }
                const usuarioId = user.userId;
                const response = await fetch(`${import.meta.env.VITE_TM_API}/api/favoritos/usuario/${usuarioId}`);
                if (response.ok) {
                    const data = await response.json();
                    setFavoritos(data.eventos || []);
                } else {
                    throw new Error('Error al cargar favoritos');
                }
            } catch (error) {
                console.error('Error al cargar favoritos:', error);
                setError('Error al cargar favoritos');
            } finally {
                setCargando(false);
            }
        };
        cargarFavoritos();
    }, [user]);

    const handleEventoClick = (evento) => {
        navigate('/evento', { state: { evento } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-white mb-4">Mis Favoritos</h2>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {cargando && (
                    <div className="text-center py-12">
                        <p className="text-slate-300">Cargando favoritos...</p>
                    </div>
                )}

                {!cargando && !error && favoritos.length === 0 && (
                    <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-8 text-center">
                        <p className="text-slate-300">No tienes eventos favoritos aún.</p>
                    </div>
                )}

                {!cargando && favoritos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favoritos.map((evento, i) => (
                            <PresentCard
                                key={evento.id || `favorito-${i}`}
                                imageSrc={evento.portada || evento.imageSrc}
                                title={evento.nombre || evento.title}
                                description={evento.descripcionLarga || evento.description}
                                rating={evento.rating || (4 + Math.random()).toFixed(1)}
                                onClick={() => handleEventoClick(evento)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <FooterUsuario />
        </div>
    );
}