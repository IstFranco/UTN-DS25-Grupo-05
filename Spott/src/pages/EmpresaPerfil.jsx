import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import crearImg from '../img/CrearLogo.jpeg';
import '../app.css';

export default function EmpresaPerfil() {
    const navigate = useNavigate();

    return (
         <div className="perfil">
            {/* Header */}
            <header className="header">
                <button onClick={() => navigate('/empresa')}>
                    <span id="back">Volver</span>
                </button>
                <h1>Perfil</h1>
                <div></div>
            </header>

            {/* Información del Perfil */}
            <div>
                <img src={perfilImg} alt="Foto de perfil" id="logo" />
                <h2>Usuario Spott</h2>
                <p>usuario@spott.com</p>
            </div>

            {/* Botones de Opciones */}
            <div className="botones">
                <button className="quick-btn">
                    <span className="icon">⚙️</span>
                    <span className="text">Configuración</span>
                </button>
                <button className="quick-btn">
                    <span className="icon">🔒</span>
                    <span className="text">Privacidad</span>
                </button>
                <button className="quick-btn">
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

            {/* Footer Inferior */}
            <footer className="footer">
                <button className="footer-btn">
                    <img src={explorarImg} id="logo" alt="Explorar" />
                    Explorar
                </button>
                <button className="footer-btn" onClick={() => navigate('/empresa')}>
                    <img src={homeImg} id="logo" alt="Inicio" />
                    Inicio
                </button>
                <button
                    className="footer-btn"
                    onClick={() => navigate('/empresa/crearevento')}
                >
                    <img src={crearImg} id="logo" alt="Crear Evento" />
                    Crear Evento
                </button>
            </footer>
        </div>
    );
}