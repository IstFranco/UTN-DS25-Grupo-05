import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';

export default function EmpresaPerfil() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Header */}
            <Header
                title="Perfil"
                className="header-perfil"
                leftButton={{ content: 'Volver', to: '/empresa' }}
            />
            <div className='perfil'>

                {/* Información del Perfil */}
                <div>
                    <img src={perfilImg} alt="Foto de perfil" className="fotoPerfil" />
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
            </div>
            {/* Footer Inferior */}
            <FooterEmpresa />
        </div>
    );
}