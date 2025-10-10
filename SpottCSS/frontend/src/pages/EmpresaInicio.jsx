import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import PresentCard from '../components/PresentCard';

export default function EmpresaInicio() {
    const navigate = useNavigate();

    const [misEventos, setMisEventos] = useState([]);

    // Cargar mis eventos desde localStorage
    useEffect(() => {
        const eventosGuardados = JSON.parse(localStorage.getItem('misEventos')) || [];
        setMisEventos(eventosGuardados);
    }, []);

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

        {/* Mis eventos */}
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

        <FooterEmpresa />
        </div>
    );
}
