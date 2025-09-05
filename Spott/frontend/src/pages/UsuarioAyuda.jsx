import Header from "../components/Header";
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';

export default function UsuarioAyuda() {
  const mailContacto = "soporte@spott.com"; // Crear el mail y actualizarlo

    return (
    <div>
        <Header
        title="Spott"
        leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
        rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
        />

        <div className="ayuda">
        <h2 className="ayuda_title">Ayuda</h2>
        <p className="ayuda_subtitle">
            Preguntas frecuentes sobre el uso de Spott.
        </p>

        <section className="faq">
            <details className="faq_item">
            <summary className="faq_q">¿Cómo encuentro eventos?</summary>
            <div className="faq_a">
                Desde la pantalla principal, navegá por las secciones y usá los filtros para explorar los eventos disponibles.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo me inscribo a un evento?</summary>
            <div className="faq_a">
                Entrá al detalle del evento y seleccioná “Inscribirse”. Si la acción fue exitosa, vas a ver la confirmación en pantalla.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo me desinscribo de un evento?</summary>
            <div className="faq_a">
                Desde el detalle del evento (o desde “Mis eventos”), elegí “Desinscribirse” para cancelar tu participación.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Dónde veo mis eventos guardados o favoritos?</summary>
            <div className="faq_a">
                En la sección de favoritos podés consultar los eventos que marcaste. Los eventos a los que te inscribiste aparecen en “Mis eventos”.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo funcionan las notificaciones?</summary>
            <div className="faq_a">
                Te informan sobre cambios relevantes de tus eventos y novedades. Consultalas desde el ícono de notificaciones.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo funciona la votación de canciones del evento?</summary>
            <div className="faq_a">
                En el detalle del evento podés votar canciones con “Me gusta” o “No me gusta”. El conteo se actualiza automáticamente.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">No veo el botón de inscribirme / me aparece un error</summary>
            <div className="faq_a">
                Verificá que hayas iniciado sesión y recargá la página. Si persiste, probá cerrar sesión y volver a entrar.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">No me aparecen eventos o tarda en cargar</summary>
            <div className="faq_a">
                Revisá tu conexión a internet y actualizá la página. Si continúa, intentá más tarde.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">Privacidad y datos personales</summary>
            <div className="faq_a">
                Ajustá tus preferencias desde la sección de Privacidad en tu perfil.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">Problemas con mi cuenta</summary>
            <div className="faq_a">
                Si necesitás asistencia con tu cuenta, escribinos mediante el botón de contacto al final de esta página.
            </div>
            </details>
        </section>

        <div className="ayuda_contacto">
            <a className="btn_contacto" href={`mailto:${mailContacto}`}>Contacto</a>
        </div>

        <FooterUsuario />
        </div>
    </div>
    );
}
