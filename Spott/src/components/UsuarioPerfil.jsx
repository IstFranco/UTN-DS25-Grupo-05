import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import favImg from '../img/LogoFav.jpeg';
import '../app.css';

export default function UsuarioPerfil() {
    const navigate = useNavigate();

    return (
        <div className="container">
            {/* Header Superior */}
            <header className="header">
                <button onClick={() => navigate('/usuario')}>
                    <span id="back">Volver</span>
                </button>
                <h1>Perfil</h1>
                <div></div>
            </header>

            <div className="perfil">
                <div>
                    <img src={perfilImg} alt="Foto de perfil" id="logo" />
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
            <footer className="footer">
                <button className="footer-btn">
                    <img src={explorarImg} id="logo" alt="Explorar" />
                    Explorar
                </button>
                <button className="footer-btn" onClick={() => navigate('/usuario')}>
                    <img src={homeImg} id="logo" alt="Inicio" />
                    Inicio
                </button>
                <button className="footer-btn" onClick={() => navigate('/usuario/favoritos')}>
                    <img src={favImg} id="logo" alt="Favoritos" />
                    Favoritos
                </button>
            </footer>
        </div>
    );
}