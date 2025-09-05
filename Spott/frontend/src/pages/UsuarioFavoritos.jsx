import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';
import PresentCard from '../components/PresentCard';
import '../app.css';

export default function UsuarioFavoritos() {
    const navigate = useNavigate();
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarFavoritos = async () => {
            try {
                const usuarioData = JSON.parse(localStorage.getItem('usuario') || '{}');
                const usuarioId = usuarioData.id;

                if (!usuarioId) {
                    setError('No se encontró información del usuario');
                    return;
                }

                const response = await fetch(`http://localhost:3001/api/favoritos/usuario/${usuarioId}`);
                
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
    }, []);

    const handleEventoClick = (evento) => {
        navigate('/evento', { state: { evento } });
    };

    return (
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />
       
            <div className="favoritos">
                <h2 className="section-title">Mis Favoritos</h2>
                
                {error && (
                    <div style={{ color: '#ff4444', textAlign: 'center', padding: '20px' }}>
                        {error}
                    </div>
                )}

                {cargando && <p style={{ color: 'white', textAlign: 'center' }}>Cargando favoritos...</p>}
                
                {!cargando && !error && favoritos.length === 0 && (
                    <p style={{ color: 'white', textAlign: 'center' }}>
                        No tienes eventos favoritos aún.
                    </p>
                )}

                {!cargando && favoritos.length > 0 && favoritos.map((evento, i) => (
                    <PresentCard
                        key={evento.id || `favorito-${i}`}
                        imageSrc={evento.portada || evento.imageSrc}
                        title={evento.nombre || evento.title}
                        description={evento.descripcionLarga || evento.description}
                        rating={evento.rating || (4 + Math.random()).toFixed(1)}
                        onClick={() => handleEventoClick(evento)}
                    />
                ))}

                <div className="footer-spacer"></div>
                <FooterUsuario />
            </div>
        </div>
    );
}