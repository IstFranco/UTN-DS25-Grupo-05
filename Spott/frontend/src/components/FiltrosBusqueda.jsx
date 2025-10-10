import useToggle from "../hooks/useToggle";

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
        
        onAplicarFiltros(nuevosFiltros);
        toggle(); // Cerrar el dropdown después de aplicar
    };

    return (
        <section className="mb-6">
            {/* Barra de búsqueda y botón filtrar */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Buscar eventos..."
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button 
                    onClick={toggle}
                    className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
                >
                    {visible ? "Ocultar" : "Filtrar"}
                    <span className={`transition-transform ${visible ? 'rotate-180' : ''}`}>▼</span>
                </button>
            </div>

            {/* Dropdown de filtros */}
            {visible && (
                <div className="mt-4 bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-6 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Filtro por Fecha */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">📅 Fecha</h3>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Fecha específica:</label>
                                <input 
                                    type="date" 
                                    id="fecesp" 
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Rango de fechas:</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="date" 
                                        id="fecini" 
                                        className="flex-1 px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                    />
                                    <span className="text-slate-400">a</span>
                                    <input 
                                        type="date" 
                                        id="fecfin" 
                                        className="flex-1 px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Fechas rápidas:</label>
                                <select 
                                    id="fecrap"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Hoy</option>
                                    <option>Mañana</option>
                                    <option>Este fin de semana</option>
                                    <option>Próxima semana</option>
                                    <option>Próximo feriado</option>
                                </select>
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">📍 Ubicación</h3>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Ciudad:</label>
                                <select 
                                    id="ciudad"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Elija la ciudad...</option>
                                    <option>Buenos Aires</option>
                                    <option>Córdoba</option>
                                    <option>Rosario</option>
                                    <option>Mendoza</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Barrio/Zona:</label>
                                <select 
                                    id="barrio"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Elija el barrio...</option>
                                    <option>Palermo</option>
                                    <option>San Telmo</option>
                                    <option>Nueva Córdoba</option>
                                    <option>Centro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Distancia:</label>
                                <select 
                                    id="distancia"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Menos de 2 km</option>
                                    <option>De 2 a 5 km</option>
                                    <option>Más de 5 km</option>
                                </select>
                            </div>
                        </div>

                        {/* Ambientación */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">🎨 Ambientación</h3>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Estilo general:</label>
                                <select 
                                    id="estgen"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Casual</option>
                                    <option>Elegante</option>
                                    <option>Temático</option>
                                    <option>Glam</option>
                                    <option>Alternativo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Temáticas:</label>
                                <select 
                                    id="temesp"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Neon party</option>
                                    <option>Halloween</option>
                                    <option>Años 80 / 90 / 2000</option>
                                    <option>White party</option>
                                    <option>Carnaval / tropical</option>
                                    <option>Cosplay / Anime</option>
                                </select>
                            </div>
                        </div>

                        {/* Tipo de Música */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">🎧 Tipo de Música</h3>
                            <select 
                                id="genmus"
                                className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                            >
                                <option value="">Todos los géneros</option>
                                <option>Electrónica (Techno, House, EDM)</option>
                                <option>Reggaetón / Latin</option>
                                <option>Rock / Indie</option>
                                <option>Pop</option>
                                <option>Trap / Hip hop</option>
                                <option>Jazz / Funk / Soul</option>
                                <option>Música en vivo</option>
                            </select>
                        </div>

                        {/* Precio */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">💰 Precio</h3>
                            <label className="flex items-center gap-2 text-slate-300">
                                <input 
                                    type="checkbox" 
                                    id="entgrat"
                                    className="w-4 h-4 accent-purple-600"
                                />
                                Entrada gratuita
                            </label>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Rango de precios:</label>
                                <select 
                                    id="rango"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                >
                                    <option>Hasta $3.000</option>
                                    <option>$3.000 a $7.000</option>
                                    <option>Más de $7.000</option>
                                </select>
                            </div>
                        </div>

                        {/* Popularidad */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">🔥 Popularidad</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" id="masvot" className="w-4 h-4 accent-purple-600" />
                                    Eventos más votados
                                </label>
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" id="mascom" className="w-4 h-4 accent-purple-600" />
                                    Más comentarios positivos
                                </label>
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" id="tenact" className="w-4 h-4 accent-purple-600" />
                                    Tendencias actuales
                                </label>
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" id="mejororg" className="w-4 h-4 accent-purple-600" />
                                    Organizadores top
                                </label>
                            </div>
                        </div>

                        {/* Disponibilidad */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-lg mb-3">✅ Disponibilidad</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" id="disp" className="w-4 h-4 accent-purple-600" />
                                    Con entradas disponibles
                                </label>
                                <label className="flex items-center gap-2 text-slate-300">
                                    <input type="checkbox" id="ult" className="w-4 h-4 accent-purple-600" />
                                    Últimos lugares
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Botón confirmar */}
                    <button 
                        type="button"
                        onClick={aplicarFiltros}
                        className="mt-6 w-full bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg"
                    >
                        Confirmar Filtros
                    </button>
                </div>
            )}
        </section>
    );
}