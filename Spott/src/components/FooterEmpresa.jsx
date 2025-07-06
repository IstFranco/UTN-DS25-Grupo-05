import React from 'react';
import { useNavigate } from 'react-router-dom';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import crearImg from '../img/CrearLogo.jpeg';
import '../app.css';

export default function FooterEmpresa() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <button className="footer-btn">
                <img src={explorarImg} className="footer-icon" alt="Explorar" />
                Explorar
            </button>
            <button className="footer-btn" onClick={() => navigate('/empresa')}>
                <img src={homeImg} className="footer-icon" alt="Inicio" />
                Inicio
            </button>
            <button className="footer-btn" onClick={() => navigate('/empresa/CrearEvento')}>
                <img src={crearImg} className="footer-icon" alt="Crear Evento" />
                Crear Evento
            </button>
        </footer>
    );
}