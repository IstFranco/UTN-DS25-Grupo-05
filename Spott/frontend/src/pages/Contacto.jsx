import Header from "../components/Header";
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';

export default function Contacto() {
    return (
    <div>
        <Header
        title="Spott"
        leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
        rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
        />

        <div className="contacto">
        <h2 className="contacto_title">Contacto</h2>
        <p className="contacto_subtitle">Aquí tenés nuestra información de contacto.</p>

        <div className="contacto_card">
            <h3>Email</h3>
            <p>soporte@spott.com</p> {/* Agregar mail */}
        </div>

        <div className="contacto_card">
            <h3>Teléfono</h3>
            <p>+54 2355 400119</p>
        </div>

        <div className="contacto_card">
            <h3>Redes sociales</h3> {/* Agregar Redes */}
            <p>Instagram: @spott_app</p>
            <p>Twitter: @spott_app</p>
        </div>

        <FooterUsuario />
        </div>
    </div>
    );
}