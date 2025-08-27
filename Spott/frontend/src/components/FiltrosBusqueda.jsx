import useToggle from "../hooks/useToggle";
import "../app.css";

export default function FiltrosBusqueda({ busqueda, setBusqueda, onAplicarFiltros }) {
    const [visible, toggle] = useToggle(false);

    const aplicarFiltros = () => {
        const nuevosFiltros = {};

        const ciudad = document.getElementById("ciudad")?.value;
        const barrio = document.getElementById("barrio")?.value;
        const generoMusical = document.getElementById("genmus")?.value;
        const fechaEspecifica = document.getElementById("fecesp")?.value;
        const fechaDesde = document.getElementById("fecini")?.value;
        const fechaHasta = document.getElementById("fecfin")?.value;

        if (ciudad && ciudad !== "Elija la ciudad...") nuevosFiltros.ciudad = ciudad;
        if (barrio && barrio !== "Elija el barrio...") nuevosFiltros.barrio = barrio;
        if (generoMusical) nuevosFiltros.musica = generoMusical;

        if (fechaEspecifica) {
            nuevosFiltros.fechaDesde = fechaEspecifica;
            nuevosFiltros.fechaHasta = fechaEspecifica;
        } else {
            if (fechaDesde) nuevosFiltros.fechaDesde = fechaDesde;
            if (fechaHasta) nuevosFiltros.fechaHasta = fechaHasta;
        }

        // TODO: acá podés mapear más filtros si querés que impacten en el backend

        onAplicarFiltros(nuevosFiltros);
    };

    return (
        <section>
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Buscar eventos..."
                    className="search-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button className="btn-filter" onClick={toggle}>
                    {visible ? "Ocultar" : "Filtrar"}
                    <span className="arrow">{visible ? "▲" : "▼"}</span>
                </button>
            </div>

            {visible && (
                <section id="filtersDropdown" className="filters-dropdown">
                    <div className="filter-group-div" id="x">

                        {/* 🗓 Filtro por Fecha */}
                        <div className="filter-group">
                            <label>📅 Fecha</label>
                            <div>
                                <label>Fecha específica:</label>
                                <input type="date" id="fecesp" />
                            </div>
                            <div>
                                <label>Rango de fechas:</label>
                                <input type="date" id="fecini" /> a
                                <input type="date" id="fecfin" />
                            </div>
                            <div>
                                <label>Fechas rápidas:</label>
                                <select id="fecrap">
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
                                <select id="ciudad">
                                    <option>Elija la ciudad...</option>
                                    <option>Buenos Aires</option>
                                    <option>Córdoba</option>
                                    <option>Rosario</option>
                                    <option>Mendoza</option>
                                </select>
                            </div>
                            <div>
                                <label>Barrio/Zona:</label>
                                <select id="barrio">
                                    <option>Elija el barrio...</option>
                                    <option>Palermo</option>
                                    <option>San Telmo</option>
                                    <option>Nueva Córdoba</option>
                                    <option>Centro</option>
                                </select>
                            </div>
                            <div>
                                <label>Distancia desde mi ubicación:</label>
                                <select id="distancia">
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
                                <select id="estgen">
                                    <option>Casual</option>
                                    <option>Elegante</option>
                                    <option>Temático</option>
                                    <option>Glam</option>
                                    <option>Alternativo</option>
                                </select>
                            </div>
                            <div>
                                <label>Temáticas:</label>
                                <select id="temesp">
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
                            <select id="genmus">
                                <option>Electrónica (Techno, House, EDM)</option>
                                <option>Reggaetón / Latin</option>
                                <option>Rock / Indie</option>
                                <option>Pop</option>
                                <option>Trap / Hip hop</option>
                                <option>Jazz / Funk / Soul</option>
                                <option>Música en vivo</option>
                            </select>
                        </div>

                        {/* 💰 Filtro por Precio */}
                        <div className="filter-group">
                            <label>💰 Precio o Entrada</label>
                            <div>
                                <label>
                                    <input type="checkbox" id="entgrat" />
                                    Entrada gratuita
                                </label>
                            </div>
                            <div>
                                <label>Rango de precios:</label>
                                <select id="rango">
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
                                <label><input type="checkbox" id="masvot" /> Eventos más votados</label><br />
                                <label><input type="checkbox" id="mascom" /> Más comentarios positivos</label><br />
                                <label><input type="checkbox" id="tenact" /> Tendencias actuales</label><br />
                                <label><input type="checkbox" id="mejororg" /> Organizadores top</label>
                            </div>
                        </div>

                        {/* ✅ Filtro por Disponibilidad */}
                        <div className="filter-group">
                            <label>✅ Disponibilidad</label>
                            <div>
                                <label><input type="checkbox" id="disp" /> Con entradas disponibles</label><br />
                                <label><input type="checkbox" id="ult" /> Últimos lugares</label>
                            </div>
                        </div>
                    </div>

                    <button id="confirmar-filtro" type="button" onClick={aplicarFiltros}><b>Confirmar</b></button>
                        <h3 id="resultado"></h3>
                </section>
            )}
        </section>
    );
}
