import Header from "../components/Header";
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';
export default function UsuarioAyuda() {
    return (
        <div>
            {/* Header */}
                <Header
                    title="Spott"
                    leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                    rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
                />
        
            <div className="ayuda">
                <h1>¿Necesitas ayuda?</h1>
                <p>
                    ¡Bienvenido a nuestra plataforma! Aquí puedes registrarte fácilmente a los
                    eventos que más te interesan y participar sugiriendo canciones para que la
                    música sea de tu agrado.
                </p>

                <h3>¿Cómo registrarte a un evento?</h3>
                <ul>
                    <li>Inicia sesión o crea tu cuenta.</li>
                    <li>Navega por la lista de eventos disponibles</li>
                    <li>Haz clic en “Registrar” en el evento que quieras asistir.</li>
                    <li>Recibirás una confirmación por correo electrónico.</li>
                </ul>
                <FooterUsuario />
            </div>
        </div>
        
    );
}
