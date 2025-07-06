import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import Header from '../components/Header';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';
import '../app.css';

export default function UsuarioPerfil() {
    const navigate = useNavigate();

    return (
        <div>
                <Header
                    title="Spott"
                    leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                    rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
                />
            
            <div className="container">

                <div className="perfil">
                    <div>
                        <img src={perfilImg} alt="Foto de perfil" className="fotoPerfil" />
                        <h2>Usuario Spott</h2>
                        <p>usuario@spott.com</p>
                    </div>
                    <div className="botones">
                        <button className="quick-btn">
                            <span className="icon">⚙️</span>
                            <span className="text">Configuración</span>
                        </button>
                        <button className="quick-btn">
                            <span className="icon">🔒</span>
                            <span className="text">Privacidad</span>
                        </button>
                        <button className="quick-btn" onClick={() => navigate('/usuario/ayuda')}>
                            <span className="icon">❓</span>
                            <span className="text">Ayuda</span>
                        </button>
                        <button
                            className="quick-btn"
                            onClick={() => navigate('/')}
                        >
                            <span className="icon">🚪</span>
                            <span className="text">Cerrar sesión</span>
                        </button>
                    </div>
                </div>

                {/* Footer Inferior */}
                <FooterUsuario />
            </div>
        </div>
    );
}