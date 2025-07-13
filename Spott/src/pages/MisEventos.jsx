import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useToggle from '../hooks/useToggle';
import Header from '../components/Header';
import FooterUsuario from '../components/FooterUsuario';
import FooterEmpresa from '../components/FooterEmpresa';
import PresentCard from '../components/PresentCard';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import '../app.css';

export default function MisEventos() {
    const [eventosInscritos, setEventosInscritos] = useState([]);
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [visible, toggle] = useToggle();

    const location = useLocation();
    const esEmpresa = location.pathname.startsWith('/empresa');
    const rol = esEmpresa ? 'empresa' : 'usuario';

    useEffect(() => {
        const clave = rol === 'empresa' ? 'misEventos' : 'eventosUsuario';
        const guardados = JSON.parse(localStorage.getItem(clave)) || [];
        setEventosInscritos(guardados);
    }, [rol]);

    const eventosFiltrados = eventosInscritos.filter(evento =>
        evento.title.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/usuario/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/usuario/notificaciones' }}
            />

            <div className='inicio'>
                <section className="search-section">
                    <input
                        type="text"
                        placeholder="Buscar eventos..."
                        className="search-input"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                    <button className="btn-filter" onClick={toggle}>
                        {visible ? 'Ocultar' : 'Filtrar'}
                        <span className="arrow">{visible ? '▲' : '▼'}</span>
                    </button>
                    </section>

                    {/* Filtros desplegables */}
                    {visible && (
                        <section id="filtersDropdown" className="filters-dropdown">
                        <div className="filter-group-div" id="x">

                            {/* 🗓 Filtro por Fecha */}
                            <div className="filter-group">
                            <label>📅 Fecha</label>
                            <div>
                                <label>Fecha específica:</label>
                                <input type="date" name="fecha-especifica" id="fecesp" />
                            </div>
                            <div>
                                <label>Rango de fechas:</label>
                                <input type="date" name="fecha-desde" id="fecini" /> a
                                <input type="date" name="fecha-hasta" id="fecfin" />
                            </div>
                            <div>
                                <label>Fechas rápidas:</label>
                                <select name="fechas-rapidas" id="fecrap">
                                <option>Hoy</option>
                                <option>Mañana</option>
                                <option>Este fin de semana</option>
                                <option>Próxima semana</option>
                                <option>Próximo feriado</option>
                                </select>
                            </div>
                            </div>

                            {/* 📍 Ubicación */}
                            <div className="filter-group">
                            <label>📍 Ubicación</label>
                            <div>
                                <label>Ciudad:</label>
                                <select name="ciudad" id="ciudad">
                                <option>Elija la ciudad...</option>
                                <option>Buenos Aires</option>
                                <option>Córdoba</option>
                                <option>Rosario</option>
                                <option>Mendoza</option>
                                </select>
                            </div>
                            <div>
                                <label>Barrio/Zona:</label>
                                <select name="barrio" id="barrio">
                                <option>Elija el barrio...</option>
                                <option>Palermo</option>
                                <option>San Telmo</option>
                                <option>Nueva Córdoba</option>
                                <option>Centro</option>
                                </select>
                            </div>
                            <div>
                                <label>Distancia desde mi ubicación:</label>
                                <select name="distancia" id="distancia">
                                <option>Menos de 2 km</option>
                                <option>De 2 a 5 km</option>
                                <option>Más de 5 km</option>
                                </select>
                            </div>
                            </div>

                            {/* 🎨 Filtro por Ambientación */}
                            <div className="filter-group">
                            <label>🎨 Ambientación</label>
                            <div>
                                <label>Estilo general:</label>
                                <select name="estilo-general" id="estgen">
                                <option>Casual</option>
                                <option>Elegante</option>
                                <option>Temático</option>
                                <option>Glam</option>
                                <option>Alternativo</option>
                                </select>
                            </div>
                            <div>
                                <label>Temáticas:</label>
                                <select name="tematica-especifica" id="temesp">
                                <option>Neon party</option>
                                <option>Halloween</option>
                                <option>Años 80 / 90 / 2000</option>
                                <option>White party (ropa blanca)</option>
                                <option>Carnaval / tropical</option>
                                <option>Cosplay / Anime</option>
                                <option>Interior / cerrado</option>
                                <option>Exterior / jardín o terraza</option>
                                <option>Con luces led / proyecciones</option>
                                <option>Ambientación inmersiva o artística</option>
                                </select>
                            </div>
                            </div>

                            {/* 🎧 Filtro por Tipo de Música */}
                            <div className="filter-group">
                            <label>🎧 Tipo de Música</label>
                            <div>
                                <label>Género musical:</label>
                                <select name="genero-musical" id="genmus">
                                <option>Electrónica (Techno, House, EDM)</option>
                                <option>Reggaetón / Latin</option>
                                <option>Rock / Indie</option>
                                <option>Pop</option>
                                <option>Trap / Hip hop</option>
                                <option>Jazz / Funk / Soul</option>
                                <option>Música en vivo</option>
                                </select>
                            </div>
                            </div>

                            {/* 💰 Filtro por Precio o Entrada */}
                            <div className="filter-group">
                            <label>💰 Precio o Entrada</label>
                            <div>
                                <label>
                                <input type="checkbox" name="entrada-gratis" id="entgrat" />
                                Entrada gratuita
                                </label>
                            </div>
                            <div>
                                <label>Rango de precios:</label>
                                <select name="rango-precios" id="rango">
                                <option>Hasta $3.000</option>
                                <option>$3.000 a $7.000</option>
                                <option>Más de $7.000</option>
                                </select>
                            </div>
                            </div>

                            {/* 🔥 Filtro por Popularidad */}
                            <div className="filter-group">
                            <label>🔥 Popularidad</label>
                            <div>
                                <label><input type="checkbox" name="mas-votados" id="masvot" /> Eventos más votados</label><br />
                                <label><input type="checkbox" name="comentarios-positivos" id="mascom" /> Más comentarios positivos</label><br />
                                <label><input type="checkbox" name="tendencias" id="tenact" /> Tendencias actuales / destacados</label><br />
                                <label><input type="checkbox" name="organizadores-top" id="mejororg" /> Organizadores mejor calificados</label>
                            </div>
                            </div>

                            {/* ✅ Filtro por Disponibilidad */}
                            <div className="filter-group">
                            <label>✅ Disponibilidad</label>
                            <div>
                                <label><input type="checkbox" name="disponibles" id="disp" /> Con entradas disponibles</label><br />
                                <label><input type="checkbox" name="ultimos-lugares" id="ult" /> Últimos lugares</label>
                            </div>
                            </div>
                        </div>

                        <button id="confirmar-filtro" type="button"><b>Confirmar</b></button>
                        <h3 id="resultado"></h3>
                    </section>
                )}

            {/* Mis eventos */}
            <div className='misEventos'>
    <h2 className="section-title">Mis eventos</h2>
    {eventosFiltrados.length === 0 ? (
        <p style={{ color: 'white', textAlign: 'center' }}>No se encontraron eventos.</p>
    ) : (
        eventosFiltrados.map((evento, i) => (
            <div
                key={`inscripto-${i}`}
                className="evento-item"
                onClick={() => {
                    if (esEmpresa) {
                        navigate('/empresa/editar-evento', { state: { evento } });
                    } else {
                        navigate('/evento-inscripto', { state: { evento } });
                    }
                }}
            >
                <div className="evento-imagen">
                    <img src={evento.imageSrc} alt={evento.title} />
                </div>
                <div className="evento-info">
                    <div>
                        <h3 className="evento-titulo">{evento.title}</h3>
                        <p className="evento-musica">{evento.musica}</p>
                    </div>
                    <div className="evento-rating">⭐ {evento.rating}</div>
                </div>
            </div>
        ))
    )}
</div>

            {rol === 'empresa' ? <FooterEmpresa /> : <FooterUsuario />}
        </div>
        </div>
    );
}