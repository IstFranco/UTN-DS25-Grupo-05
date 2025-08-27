import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';
import PresentCard from '../components/PresentCard';
import '../app.css';

export default function UsuarioFavoritos() {
    const navigate = useNavigate();

    return (
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />
        
            <div className="favoritos">

                {/* Eventos Favoritos */}
                <div className="favoritos-seccion">
                    <h2 className="section-title">Eventos favoritos</h2>
                    <PresentCard
                        imageSrc=""
                        title="Concierto de Verano"
                        description="Disfruta de los mejores artistas en nuestro festival anual."
                        rating="4.7"
                    />
                    <PresentCard
                        imageSrc=""
                        title="Exposición de Arte"
                        description="Obras contemporáneas de artistas emergentes."
                        rating="4.9"
                    />
                </div>

                {/* Creadores Favoritos */}
                <div className="favoritos-seccion">
                    <h2 className="section-title">Creadores favoritos</h2>
                    <article className="event-card">
                        <div className="event-image">
                            <img src="" alt="" />
                        </div>
                        <div className="event-info">
                            <h3 className="event-title">Nombre Apellido</h3>
                            <p className="event-description">
                                Disfruta de los mejores artistas en nuestro festival anual.
                            </p>
                            <div className="event-rating">⭐ 4.7</div>
                        </div>
                    </article>
                    <article className="event-card">
                        <div className="event-image"></div>
                        <div className="event-info">
                            <h3 className="event-title">Nombre Apellido</h3>
                            <p className="event-description">
                                Obras contemporáneas de artistas emergentes.
                            </p>
                            <div className="event-rating">⭐ 4.9</div>
                        </div>
                    </article>
                </div>

                <div className="footer-spacer"></div>
                {/* Footer Inferior */}
                <FooterUsuario />
            </div>
        </div>
    );
}