    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import perfilImg from '../img/LogoPerfil.jpeg';
    import notiImg from '../img/LogoNotificaciones.jpeg';
    import Header from '../components/Header';
    import FooterEmpresa from '../components/FooterEmpresa';
    import PresentCard from '../components/PresentCard';
    import '../app.css';

    export default function EmpresaInicio() {
    const navigate = useNavigate();

    const [activos, setActivos] = useState([]);
    const [valorados, setValorados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [misEventos, setMisEventos] = useState([]);

useEffect(() => {
    const apiKey = import.meta.env.VITE_TM_API;

    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=12&keyword=festival&apikey=${apiKey}`)
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar eventos de Ticketmaster');
            return res.json();
        })
        .then(data => {
            const eventos = data._embedded?.events || [];

            const transformarEvento = e => ({
                imageSrc: e.images?.[0]?.url || '',
                title: e.name,
                description: e.info || e.description || 'Sin descripción disponible.',
                rating: (4 + Math.random()).toFixed(1)
            });

            setActivos(eventos.slice(0, 3).map(transformarEvento));
            setValorados(eventos.slice(3, 6).map(transformarEvento));
            setCargando(false);
        })
        .catch(err => {
            setError(err.message);
            setCargando(false);
        });
}, []); // Cierre correcto

// SEGUNDO useEffect: leer mis eventos desde localStorage
useEffect(() => {
    const eventosGuardados = JSON.parse(localStorage.getItem('misEventos')) || [];
    setMisEventos(eventosGuardados);
}, []);

    if (cargando) return <p>Cargando eventos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="inicio">
        <Header
            title="Spott"
            leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
            rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
        />

        <section className="quick-access">
            {[1, 2, 3, 4].map(i => (
            <button className="quick-btn" key={i}>
                <span className="icon">Foto{i}</span>
                <span className="text">Acceso{i}</span>
            </button>
            ))}
        </section>


        {/*Mis eventos*/}
        <div className="misEventos">
            <h2>Mis eventos</h2>
            {misEventos.length === 0 ? (
                <p>No creaste ningún evento aún.</p>
            ) : (
                misEventos.map((evento, i) => (
                    <PresentCard
                        key={`mio-${i}`}
                        imageSrc={evento.imageSrc}
                        title={evento.title}
                        description={evento.description}
                        rating={evento.rating}
                    />
                ))
            )}
        </div>

        <div className="destacados">
            <h2 className="section-title">Eventos Activos del Mes</h2>
            {activos.map((evento, i) => (
            <PresentCard
                key={`activo-${i}`}
                imageSrc={evento.imageSrc}
                title={evento.title}
                description={evento.description}
                rating={evento.rating}
            />
            ))}
        </div>

        <div className="destacados">
            <h2 className="section-title">Eventos con Mejor Valoración</h2>
            {valorados.map((evento, i) => (
            <PresentCard
                key={`valorado-${i}`}
                imageSrc={evento.imageSrc}
                title={evento.title}
                description={evento.description}
                rating={evento.rating}
            />
            ))}
        </div>

        <FooterEmpresa />
        </div>
    );
}