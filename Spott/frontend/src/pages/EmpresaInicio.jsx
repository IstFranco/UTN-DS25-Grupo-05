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

    useEffect(() => {
        const eventosGuardados = JSON.parse(localStorage.getItem('misEventos')) || [];
        setMisEventos(eventosGuardados);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-white mb-4">Mis eventos</h2>
                
                {misEventos.length === 0 ? (
                    <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl p-8 text-center">
                        <p className="text-slate-300">No creaste ningún evento aún.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {misEventos.map((evento, i) => (
                            <PresentCard
                                key={`mio-${i}`}
                                imageSrc={evento.imageSrc}
                                title={evento.title}
                                description={evento.description}
                                rating={evento.rating}
                            />
                        ))}
                    </div>
                )}
            </div>

            <FooterEmpresa />
        </div>
    );
}