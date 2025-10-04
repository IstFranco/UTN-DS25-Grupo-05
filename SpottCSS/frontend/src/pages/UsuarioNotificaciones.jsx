import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';

export default function UsuarioNotificaciones() {
    const navigate = useNavigate();

    return (

        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />
            <div className="not">

                {/* Lista de Notificaciones */}
                {[...Array(6)].map((_, index) => (
                    <div className="notificacion" key={index}>
                        <div className="notification-content">
                            <span className="notification-icon">🔔</span>
                            <div>
                                <h3>Recordatorio</h3>
                                <p>Evento mañana a las 20:00</p>
                                <small>Hace 1 día</small>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Notificaciones específicas */}
                <div className="notificacion">
                    <div className="notification-content">
                        <span className="notification-icon">🎵</span>
                        <div>
                            <h3>Nuevo evento musical</h3>
                            <p>Concierto este fin de semana</p>
                            <small>Hace 2 horas</small>
                        </div>
                    </div>
                </div>
                <div className="notificacion">
                    <div className="notification-content">
                        <span className="notification-icon">👍</span>
                        <div>
                            <h3>Evento confirmado</h3>
                            <p>Tu asistencia ha sido registrada</p>
                            <small>Ayer</small>
                        </div>
                    </div>
                </div>

                {/* Footer Inferior */}
                <FooterUsuario />
            </div>
        </div>
    );
}