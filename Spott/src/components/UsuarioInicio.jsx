import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import favImg from '../img/LogoFav.jpeg';
import '../app.css';

export default function UsuarioInicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio">
      {/* Header Superior */}
      <header className="header">
        <button onClick={() => navigate('/usuario/perfil')}>
          <img src={perfilImg} alt="Perfil" id="logo" />
        </button>
        <h1>Spott</h1>
        <button onClick={() => navigate('/usuario/notificaciones')}>
          <img src={notiImg} alt="Notificaciones" id="logo" />
        </button>
      </header>

      {/* Barra de Búsqueda */}
      <section className="search-section">
        <input
          type="text"
          placeholder="Buscar eventos..."
          className="search-input"
        />
        <button className="btn-filter" id="filterBtn">
          Filtrar ▼
        </button>
      </section>

      {/* Filtros */}
      <section id="filtersDropdown" className="filters-dropdown hidden">
        <div className="filter-group-div" id="x">
          {/* Aquí siguen todos los filtros igual, con className en lugar de class */}
        </div>
        <button id="confirmar-filtro" type="button">
          <b>Confirmar</b>
        </button>
        <h3 id="resultado"></h3>
      </section>

      {/* Accesos Rápidos */}
      <section className="quick-access">
        {[1, 2, 3, 4].map(i => (
          <button className="quick-btn" key={i}>
            <span className="icon">Foto{i}</span>
            <span className="text">Acceso{i}</span>
          </button>
        ))}
      </section>

      {/* Eventos Destacados */}
      <div className="destacados">
        <h2 className="section-title">Eventos Destacados</h2>
        <article className="event-card">
          <div className="event-image">
            <img src="" alt="" />
          </div>
          <div className="event-info">
            <h3 className="event-title">Concierto de Verano</h3>
            <p className="event-description">
              Disfruta de los mejores artistas en nuestro festival anual.
            </p>
            <div className="event-rating">⭐ 4.7</div>
          </div>
        </article>
        <article className="event-card">
          <div className="event-image"></div>
          <div className="event-info">
            <h3 className="event-title">Exposición de Arte</h3>
            <p className="event-description">
              Obras contemporáneas de artistas emergentes.
            </p>
            <div className="event-rating">⭐ 4.9</div>
          </div>
        </article>
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