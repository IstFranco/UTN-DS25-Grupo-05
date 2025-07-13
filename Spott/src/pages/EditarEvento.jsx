import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';

export default function EditarEvento() {
    const { state } = useLocation();
    const evento = state?.evento;

    if (!evento) {
        return <p>No se encontró el evento.</p>;
    }

    return (
        <div>
            <Header
                title="Editar Evento"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            <div className="form-box">
                <h2>{evento.title}</h2>
                <img src={evento.imageSrc} alt={evento.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '15px' }} />
                <p><strong>Género musical:</strong> {evento.musica}</p>
                <p><strong>Descripción:</strong> {evento.description}</p>
                {/* Agregá aquí los inputs para editar y un botón para guardar */}
            </div>

            <FooterEmpresa />
        </div>
    );
}