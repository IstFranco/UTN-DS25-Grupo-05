import Header from "../components/Header";
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterEmpresa from '../components/FooterEmpresa';

export default function EmpresaAyuda() {
    return (
    <div>
      {/* Header */}
        <Header
        title="Spott"
        leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
        rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
        />

        <div className="ayuda">
        <h2 className="ayuda_title">Ayuda para Empresas</h2>
        <p className="ayuda_subtitle">
            Preguntas frecuentes sobre la gestión de eventos en Spott.
        </p>

        <section className="faq">
            <details className="faq_item">
            <summary className="faq_q">¿Cómo creo un nuevo evento?</summary>
            <div className="faq_a">
                Desde el menú principal de empresa, seleccioná “Crear evento” y completá la información requerida.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo edito la información de un evento existente?</summary>
            <div className="faq_a">
                En la sección “Mis eventos” elegí el evento y presioná “Editar evento” para actualizar su información.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo publico o despublico un evento?</summary>
            <div className="faq_a">
                Dentro de la edición del evento podés cambiar su estado a publicado o despublicado según corresponda.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo configuro cupos y tipos de entrada (general/vip)?</summary>
            <div className="faq_a">
                Al crear o editar el evento, completá los campos de cupo general y VIP para definir los límites de inscripciones.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo veo la lista de inscriptos a mi evento?</summary>
            <div className="faq_a">
                Ingresá a “Mis eventos” y seleccioná el evento. Allí tendrás la lista completa de usuarios inscriptos.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Puedo cancelar un evento? ¿Qué ven los usuarios?</summary>
            <div className="faq_a">
                Sí, podés cancelarlo desde la edición del evento. Los usuarios recibirán el aviso en sus notificaciones.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo conecto o gestiono la playlist de mi evento (Spotify)?</summary>
            <div className="faq_a">
                En la creación o edición de tu evento, podés enlazar la playlist de Spotify para que los usuarios sugieran canciones.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo funciona la votación de canciones desde el lado de la empresa?</summary>
            <div className="faq_a">
                Podés ver los votos de los usuarios en la sección de canciones del evento. Esto te ayuda a elegir la música más votada.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">¿Cómo gestiono imágenes, portada o archivos del evento?</summary>
            <div className="faq_a">
                Desde la edición del evento podés subir imágenes y seleccionar una portada que será visible en la plataforma.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">No veo mi evento en la sección Explorar</summary>
            <div className="faq_a">
                Asegurate de que el evento esté publicado, activo y que la fecha no haya pasado. También revisá los filtros aplicados.
            </div>
            </details>

            <details className="faq_item">
            <summary className="faq_q">Errores comunes al guardar o publicar</summary>
            <div className="faq_a">
                Verificá que todos los campos obligatorios estén completos y que tengas una conexión estable a internet.
            </div>
            </details>
        </section>

        <div className="ayuda_contacto">
            <a className="btn_contacto" href="/contacto">Contacto</a>
        </div>

        <FooterEmpresa />
        </div>
    </div>
    );
}
