import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa'; // <-- Correcto
import PresentCard from '../components/PresentCard';
import ApiService from '../services/api';
import FiltrosBusqueda from "../components/FiltrosBusqueda";

export default function EmpresaInicio() {
    const navigate = useNavigate();

    // --- Estados para gestionar la carga ---
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtros, setFiltros] = useState({});
    
    // --- Lógica de carga SIMPLIFICADA (sin Ticketmaster) ---
    useEffect(() => {
        const cargarEventos = async () => {
            setCargando(true);
            setError(null);

            try {
                // 1. Llamamos directamente a tu ApiService con los filtros
                const responseBackend = await ApiService.obtenerEventos({ busqueda, ...filtros });
                setEventos(responseBackend.eventos || []);

                // 2. Se eliminó toda la lógica de 'if (eventosBackend.length < 6)'
                //    y la llamada a Ticketmaster.

            } catch (backendError) {
                // 3. Si tu backend falla, simplemente mostramos un error.
                //    Ya no hay fallback a Ticketmaster.
                console.error('Error al cargar eventos del backend:', backendError);
                setError('Error al cargar eventos. Inténtalo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        cargarEventos();
    }, [busqueda, filtros]); // Se actualiza si cambia la búsqueda o filtros
    // ---------------------------------

    // --- Handler Click ---
    // Mantenemos este handler para que las tarjetas sean clickables
    const handleEventoClick = (evento) => {
        if (evento.esExterno) {
            navigate('/evento', { state: { evento, esExterno: true } });
        } else {
            navigate('/evento', { state: { evento } });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                
                {/* Filtros de Búsqueda */}
                <FiltrosBusqueda 
                    busqueda={busqueda} 
                    setBusqueda={setBusqueda} 
                    onAplicarFiltros={setFiltros} 
                />

                {/* --- Renderizado condicional (Cargando / Error / Contenido) --- */}
                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Eventos Destacados</h2>
                    
                    {cargando && (
                        <div className="text-center py-12">
                            <p className="text-slate-300">Cargando eventos...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center">
                            Error: {error}
                        </div>
                    )}
                    
                    {!cargando && !error && (
                        <>
                            {eventos.length === 0 ? (
                                <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-8 text-center">
                                    <p className="text-slate-300">
                                        {busqueda || Object.keys(filtros).length > 0
                                            ? 'No se encontraron eventos con esos filtros.'
                                            : 'No hay eventos disponibles en este momento.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {eventos.map((evento, i) => (
                                        <PresentCard
                                            key={evento.id || `evento-${i}`}
                                            imageSrc={evento.imageSrc}
                                            title={evento.title}
                                            description={evento.description}
                                            rating={evento.rating}
                                            onClick={() => handleEventoClick(evento)} // Añadido onClick
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* --------------------------------- */}

            </div>

            <FooterEmpresa /> {/* <-- Correcto */}
        </div>
    );
}