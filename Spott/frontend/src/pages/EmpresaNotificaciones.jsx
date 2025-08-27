import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import '../app.css';

export default function EmpresaNotificaciones() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Header */}
            <Header
                title="Notificaciones"
                className="header-noti"
                leftButton={{ content: 'Volver', to: '/empresa' }}
                rightButton={{ content: 'Limpiar', onClick: () => window.location.reload() }}
            />

            <div className="not">
                {/* Notificaciones */}
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

                {[...Array(4)].map((_, i) => (
                    <div className="notificacion" key={i}>
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

                {/* Footer */}
                <FooterEmpresa />
            </div>
        </div>
    );
}